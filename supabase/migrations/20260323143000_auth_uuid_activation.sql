BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
      AND column_name = 'id'
      AND udt_name = 'text'
  ) THEN
    IF to_regclass('public.legacy_profiles') IS NULL THEN
      EXECUTE 'ALTER TABLE public.profiles RENAME TO legacy_profiles';
    ELSE
      RAISE EXCEPTION 'public.legacy_profiles already exists while public.profiles is still text-based';
    END IF;
  END IF;
END
$$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'quiz_reports'
      AND column_name = 'user_id'
      AND udt_name = 'text'
  ) THEN
    IF to_regclass('public.legacy_quiz_reports') IS NULL THEN
      EXECUTE 'ALTER TABLE public.quiz_reports RENAME TO legacy_quiz_reports';
    ELSE
      RAISE EXCEPTION 'public.legacy_quiz_reports already exists while public.quiz_reports is still text-based';
    END IF;
  END IF;
END
$$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'orders'
      AND column_name = 'user_id'
      AND udt_name = 'text'
  ) THEN
    IF to_regclass('public.legacy_orders') IS NULL THEN
      EXECUTE 'ALTER TABLE public.orders RENAME TO legacy_orders';
    ELSE
      RAISE EXCEPTION 'public.legacy_orders already exists while public.orders is still text-based';
    END IF;
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  avatar_url TEXT,
  is_vip BOOLEAN NOT NULL DEFAULT FALSE,
  metadata JSONB NOT NULL DEFAULT jsonb_build_object('is_base_vip', false),
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT profiles_nickname_not_blank CHECK (length(trim(nickname)) > 0)
);

CREATE TABLE IF NOT EXISTS public.quiz_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quiz_id TEXT NOT NULL,
  result_id TEXT NOT NULL,
  scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  professional_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT quiz_reports_quiz_id_not_blank CHECK (length(trim(quiz_id)) > 0),
  CONSTRAINT quiz_reports_result_id_not_blank CHECK (length(trim(result_id)) > 0)
);

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quiz_id TEXT,
  product_type TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  provider_order_id TEXT,
  order_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  CONSTRAINT orders_amount_non_negative CHECK (amount >= 0),
  CONSTRAINT orders_status_valid CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  CONSTRAINT orders_payment_method_valid CHECK (
    payment_method IS NULL OR payment_method IN ('wechat', 'alipay')
  )
);

CREATE TABLE IF NOT EXISTS public.signup_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'email_password',
  signup_source TEXT NOT NULL DEFAULT 'web',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.activation_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL,
  tier TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  upgrade_requires_base BOOLEAN NOT NULL DEFAULT TRUE,
  max_redemptions INTEGER NOT NULL DEFAULT 1,
  redeemed_count INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT activation_codes_tier_valid CHECK (tier IN ('base', 'pro', 'upgrade')),
  CONSTRAINT activation_codes_status_valid CHECK (status IN ('active', 'disabled', 'archived')),
  CONSTRAINT activation_codes_max_redemptions_positive CHECK (max_redemptions > 0),
  CONSTRAINT activation_codes_redeemed_count_non_negative CHECK (redeemed_count >= 0)
);

CREATE TABLE IF NOT EXISTS public.activation_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activation_code_id UUID NOT NULL REFERENCES public.activation_codes(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  effective_tier TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  redeemed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT activation_redemptions_effective_tier_valid CHECK (
    effective_tier IN ('base', 'pro')
  )
);

CREATE INDEX IF NOT EXISTS quiz_reports_user_id_created_at_idx
  ON public.quiz_reports (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS orders_user_id_created_at_idx
  ON public.orders (user_id, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS orders_provider_order_id_uidx
  ON public.orders (provider_order_id)
  WHERE provider_order_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS signup_events_user_id_created_at_idx
  ON public.signup_events (user_id, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS activation_codes_code_upper_uidx
  ON public.activation_codes (upper(code));

CREATE INDEX IF NOT EXISTS activation_redemptions_user_id_redeemed_at_idx
  ON public.activation_redemptions (user_id, redeemed_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS activation_redemptions_code_user_uidx
  ON public.activation_redemptions (activation_code_id, user_id);

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_nickname TEXT;
  v_provider TEXT;
BEGIN
  v_nickname := COALESCE(
    NULLIF(NEW.raw_user_meta_data ->> 'nickname', ''),
    NULLIF(split_part(COALESCE(NEW.email, ''), '@', 1), ''),
    '探测星用户'
  );

  v_provider := COALESCE(
    NULLIF(NEW.raw_app_meta_data ->> 'provider', ''),
    'email_password'
  );

  INSERT INTO public.profiles (
    id,
    nickname,
    is_vip,
    metadata,
    last_login_at,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    v_nickname,
    FALSE,
    jsonb_build_object('is_base_vip', false),
    NEW.last_sign_in_at,
    COALESCE(NEW.created_at, NOW()),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.signup_events (
    user_id,
    email,
    provider,
    signup_source,
    metadata,
    created_at
  )
  SELECT
    NEW.id,
    COALESCE(NEW.email, ''),
    v_provider,
    'web',
    jsonb_build_object(
      'raw_user_meta_data', COALESCE(NEW.raw_user_meta_data, '{}'::jsonb)
    ),
    COALESCE(NEW.created_at, NOW())
  WHERE COALESCE(NEW.email, '') <> ''
    AND NOT EXISTS (
      SELECT 1
      FROM public.signup_events se
      WHERE se.user_id = NEW.id
    );

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_order_paid_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status = 'completed'
     AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM NEW.status)
     AND NEW.paid_at IS NULL THEN
    NEW.paid_at = NOW();
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_vip_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'completed'
     AND NEW.product_type IN ('yearly', 'member_yearly', 'member_monthly', 'pro', 'pro_yearly', 'upgrade') THEN
    UPDATE public.profiles
    SET is_vip = TRUE,
        updated_at = NOW()
    WHERE id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.redeem_activation_code(
  p_user_id UUID,
  p_code TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_normalized_code TEXT;
  v_code public.activation_codes%ROWTYPE;
  v_profile public.profiles%ROWTYPE;
  v_has_base BOOLEAN;
  v_granted_base BOOLEAN := FALSE;
  v_granted_pro BOOLEAN := FALSE;
  v_effective_tier TEXT;
BEGIN
  v_normalized_code := upper(trim(COALESCE(p_code, '')));

  IF v_normalized_code = '' THEN
    RETURN jsonb_build_object(
      'ok', FALSE,
      'message', '请输入激活码'
    );
  END IF;

  SELECT *
  INTO v_profile
  FROM public.profiles
  WHERE id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'ok', FALSE,
      'message', '请先完成登录后再激活'
    );
  END IF;

  v_has_base := COALESCE((v_profile.metadata ->> 'is_base_vip')::BOOLEAN, FALSE);

  SELECT *
  INTO v_code
  FROM public.activation_codes
  WHERE upper(code) = v_normalized_code
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'ok', FALSE,
      'message', '激活码不存在，请检查后重试'
    );
  END IF;

  IF v_code.status <> 'active' THEN
    RETURN jsonb_build_object(
      'ok', FALSE,
      'message', '该激活码当前不可用'
    );
  END IF;

  IF v_code.expires_at IS NOT NULL AND v_code.expires_at < NOW() THEN
    RETURN jsonb_build_object(
      'ok', FALSE,
      'message', '该激活码已过期'
    );
  END IF;

  IF v_code.redeemed_count >= v_code.max_redemptions THEN
    RETURN jsonb_build_object(
      'ok', FALSE,
      'message', '该激活码已被使用完毕'
    );
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.activation_redemptions ar
    WHERE ar.activation_code_id = v_code.id
      AND ar.user_id = p_user_id
  ) THEN
    RETURN jsonb_build_object(
      'ok', FALSE,
      'message', '你已经使用过这个激活码了'
    );
  END IF;

  IF v_code.tier = 'base' AND v_has_base THEN
    RETURN jsonb_build_object(
      'ok', FALSE,
      'message', '你的基础权益已经开通，无需重复激活'
    );
  END IF;

  IF v_code.tier IN ('pro', 'upgrade') AND v_profile.is_vip THEN
    RETURN jsonb_build_object(
      'ok', FALSE,
      'message', '你的 PRO 权益已经开通，无需重复激活'
    );
  END IF;

  IF v_code.tier = 'upgrade' AND COALESCE(v_code.upgrade_requires_base, TRUE) AND NOT v_has_base THEN
    RETURN jsonb_build_object(
      'ok', FALSE,
      'message', '升级码需要先开通基础权益后才能使用'
    );
  END IF;

  IF v_code.tier = 'base' THEN
    UPDATE public.profiles
    SET metadata = jsonb_set(COALESCE(metadata, '{}'::jsonb), '{is_base_vip}', 'true'::jsonb, TRUE),
        updated_at = NOW()
    WHERE id = p_user_id;

    v_granted_base := TRUE;
    v_effective_tier := 'base';
  ELSIF v_code.tier = 'pro' THEN
    UPDATE public.profiles
    SET is_vip = TRUE,
        updated_at = NOW()
    WHERE id = p_user_id;

    v_granted_pro := TRUE;
    v_effective_tier := 'pro';
  ELSIF v_code.tier = 'upgrade' THEN
    UPDATE public.profiles
    SET is_vip = TRUE,
        updated_at = NOW()
    WHERE id = p_user_id;

    v_granted_pro := TRUE;
    v_effective_tier := 'pro';
  ELSE
    RETURN jsonb_build_object(
      'ok', FALSE,
      'message', '该激活码类型不受支持'
    );
  END IF;

  INSERT INTO public.activation_redemptions (
    activation_code_id,
    user_id,
    effective_tier,
    metadata
  )
  VALUES (
    v_code.id,
    p_user_id,
    v_effective_tier,
    jsonb_build_object(
      'input_code', v_normalized_code,
      'code_tier', v_code.tier
    )
  );

  UPDATE public.activation_codes
  SET redeemed_count = redeemed_count + 1,
      updated_at = NOW()
  WHERE id = v_code.id;

  RETURN jsonb_build_object(
    'ok', TRUE,
    'message', CASE
      WHEN v_granted_pro THEN '激活成功，PRO 权益已生效'
      WHEN v_granted_base THEN '激活成功，基础权益已生效'
      ELSE '激活成功'
    END,
    'granted_pro', v_granted_pro,
    'granted_base', v_granted_base,
    'tier', v_code.tier,
    'effective_tier', v_effective_tier
  );
END;
$$;

DROP TRIGGER IF EXISTS profiles_touch_updated_at ON public.profiles;
CREATE TRIGGER profiles_touch_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS orders_touch_updated_at ON public.orders;
CREATE TRIGGER orders_touch_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS activation_codes_touch_updated_at ON public.activation_codes;
CREATE TRIGGER activation_codes_touch_updated_at
  BEFORE UPDATE ON public.activation_codes
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS orders_set_paid_at ON public.orders;
CREATE TRIGGER orders_set_paid_at
  BEFORE INSERT OR UPDATE OF status ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.set_order_paid_at();

DROP TRIGGER IF EXISTS orders_sync_vip_status ON public.orders;
CREATE TRIGGER orders_sync_vip_status
  AFTER INSERT OR UPDATE OF status ON public.orders
  FOR EACH ROW
  WHEN (NEW.status = 'completed')
  EXECUTE FUNCTION public.sync_vip_status();

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_auth_user();

INSERT INTO public.profiles (
  id,
  nickname,
  avatar_url,
  is_vip,
  metadata,
  last_login_at,
  created_at,
  updated_at
)
SELECT
  au.id,
  COALESCE(
    NULLIF(au.raw_user_meta_data ->> 'nickname', ''),
    NULLIF(split_part(COALESCE(au.email, ''), '@', 1), ''),
    '探测星用户'
  ),
  NULL,
  FALSE,
  jsonb_build_object('is_base_vip', FALSE),
  au.last_sign_in_at,
  COALESCE(au.created_at, NOW()),
  NOW()
FROM auth.users au
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.signup_events (
  user_id,
  email,
  provider,
  signup_source,
  metadata,
  created_at
)
SELECT
  au.id,
  au.email,
  COALESCE(NULLIF(au.raw_app_meta_data ->> 'provider', ''), 'email_password'),
  'web',
  jsonb_build_object(
    'raw_user_meta_data', COALESCE(au.raw_user_meta_data, '{}'::jsonb)
  ),
  COALESCE(au.created_at, NOW())
FROM auth.users au
WHERE COALESCE(au.email, '') <> ''
  AND NOT EXISTS (
    SELECT 1
    FROM public.signup_events se
    WHERE se.user_id = au.id
  );

DO $$
BEGIN
  IF to_regclass('public.legacy_profiles') IS NOT NULL THEN
    UPDATE public.profiles p
    SET nickname = COALESCE(NULLIF(lp.nickname, ''), p.nickname),
        avatar_url = COALESCE(lp.avatar_url, p.avatar_url),
        is_vip = COALESCE(lp.is_vip, p.is_vip),
        created_at = COALESCE(lp.created_at, p.created_at),
        updated_at = GREATEST(COALESCE(lp.updated_at, p.updated_at), p.updated_at)
    FROM (
      SELECT
        id::uuid AS profile_id,
        nickname,
        avatar_url,
        is_vip,
        created_at,
        updated_at
      FROM public.legacy_profiles
      WHERE id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
    ) lp
    WHERE p.id = lp.profile_id;
  END IF;
END
$$;

DO $$
BEGIN
  IF to_regclass('public.legacy_quiz_reports') IS NOT NULL THEN
    INSERT INTO public.quiz_reports (
      id,
      user_id,
      quiz_id,
      result_id,
      scores,
      professional_scores,
      metadata,
      created_at
    )
    SELECT
      lqr.id,
      lqr.user_id,
      lqr.quiz_id,
      lqr.result_id,
      COALESCE(lqr.scores, '{}'::jsonb),
      COALESCE(lqr.professional_scores, '{}'::jsonb),
      COALESCE(lqr.metadata, '{}'::jsonb),
      COALESCE(lqr.created_at, NOW())
    FROM (
      SELECT
        id,
        user_id::uuid AS user_id,
        quiz_id,
        result_id,
        scores,
        professional_scores,
        metadata,
        created_at
      FROM public.legacy_quiz_reports
      WHERE user_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
    ) lqr
    JOIN public.profiles p
      ON p.id = lqr.user_id
    ON CONFLICT (id) DO NOTHING;
  END IF;
END
$$;

DO $$
BEGIN
  IF to_regclass('public.legacy_orders') IS NOT NULL THEN
    INSERT INTO public.orders (
      id,
      user_id,
      quiz_id,
      product_type,
      amount,
      status,
      payment_method,
      provider_order_id,
      order_metadata,
      created_at,
      updated_at,
      paid_at
    )
    SELECT
      lo.id,
      lo.user_id,
      lo.quiz_id,
      lo.product_type,
      lo.amount,
      COALESCE(lo.status, 'pending'),
      lo.payment_method,
      lo.provider_order_id,
      COALESCE(lo.order_metadata, '{}'::jsonb),
      COALESCE(lo.created_at, NOW()),
      COALESCE(lo.updated_at, NOW()),
      lo.paid_at
    FROM (
      SELECT
        id,
        user_id::uuid AS user_id,
        quiz_id,
        product_type,
        amount,
        status,
        payment_method,
        provider_order_id,
        order_metadata,
        created_at,
        updated_at,
        paid_at
      FROM public.legacy_orders
      WHERE user_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
    ) lo
    JOIN public.profiles p
      ON p.id = lo.user_id
    ON CONFLICT (id) DO NOTHING;
  END IF;
END
$$;

GRANT USAGE ON SCHEMA public TO authenticated, service_role;

GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT ON public.quiz_reports TO authenticated;
GRANT SELECT ON public.orders TO authenticated;
GRANT SELECT ON public.activation_redemptions TO authenticated;

GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.quiz_reports TO service_role;
GRANT ALL ON public.orders TO service_role;
GRANT ALL ON public.signup_events TO service_role;
GRANT ALL ON public.activation_codes TO service_role;
GRANT ALL ON public.activation_redemptions TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signup_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activation_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activation_redemptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
CREATE POLICY profiles_select_own
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
CREATE POLICY profiles_update_own
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS quiz_reports_select_own ON public.quiz_reports;
CREATE POLICY quiz_reports_select_own
  ON public.quiz_reports
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS quiz_reports_insert_own ON public.quiz_reports;
CREATE POLICY quiz_reports_insert_own
  ON public.quiz_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS orders_select_own ON public.orders;
CREATE POLICY orders_select_own
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS activation_redemptions_select_own ON public.activation_redemptions;
CREATE POLICY activation_redemptions_select_own
  ON public.activation_redemptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

REVOKE ALL ON FUNCTION public.redeem_activation_code(UUID, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.redeem_activation_code(UUID, TEXT) FROM anon;
REVOKE ALL ON FUNCTION public.redeem_activation_code(UUID, TEXT) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.redeem_activation_code(UUID, TEXT) TO service_role;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'orders'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.orders';
  END IF;
EXCEPTION
  WHEN undefined_object THEN
    RAISE NOTICE 'supabase_realtime publication does not exist, skipping orders publication.';
END
$$;

COMMIT;

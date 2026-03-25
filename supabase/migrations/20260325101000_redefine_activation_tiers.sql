-- Migration to redefine activation tiers and membership logic
BEGIN;

-- 1. Update activation_codes table constraints
ALTER TABLE public.activation_codes DROP CONSTRAINT IF EXISTS activation_codes_tier_valid;
ALTER TABLE public.activation_codes ADD CONSTRAINT activation_codes_tier_valid 
  CHECK (tier IN ('basi', 'upgd', 'tpro', 'tmax'));

-- 2. Delete all existing activation codes as requested
DELETE FROM public.activation_codes;
DELETE FROM public.activation_redemptions;

-- 3. Update profiles table to support TMAX membership and daily limits
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_tmax BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tmax_expires_at TIMESTAMPTZ;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS daily_test_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_test_date DATE DEFAULT CURRENT_DATE;

-- 4. Update the redeem_activation_code function
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
  v_granted_tmax BOOLEAN := FALSE;
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

  -- Logic for new tiers
  IF v_code.tier = 'basi' THEN
    IF v_has_base OR v_profile.is_vip OR v_profile.is_tmax THEN
      RETURN jsonb_build_object('ok', FALSE, 'message', '您已拥有该权益或更高权限');
    END IF;
    
    UPDATE public.profiles
    SET metadata = jsonb_set(COALESCE(metadata, '{}'::jsonb), '{is_base_vip}', 'true'::jsonb, TRUE),
        updated_at = NOW()
    WHERE id = p_user_id;
    v_granted_base := TRUE;
    v_effective_tier := 'basi';

  ELSIF v_code.tier = 'tpro' THEN
    IF v_profile.is_vip OR v_profile.is_tmax THEN
      RETURN jsonb_build_object('ok', FALSE, 'message', '您已拥有 PRO 或更高权限');
    END IF;
    
    UPDATE public.profiles
    SET is_vip = TRUE,
        updated_at = NOW()
    WHERE id = p_user_id;
    v_granted_pro := TRUE;
    v_effective_tier := 'tpro';

  ELSIF v_code.tier = 'upgd' THEN
    IF v_profile.is_vip OR v_profile.is_tmax THEN
      RETURN jsonb_build_object('ok', FALSE, 'message', '您已拥有 PRO 或更高权限');
    END IF;
    
    IF NOT v_has_base THEN
      RETURN jsonb_build_object('ok', FALSE, 'message', '升级码仅限基础款用户使用');
    END IF;
    
    UPDATE public.profiles
    SET is_vip = TRUE,
        updated_at = NOW()
    WHERE id = p_user_id;
    v_granted_pro := TRUE;
    v_effective_tier := 'tpro';

  ELSIF v_code.tier = 'tmax' THEN
    UPDATE public.profiles
    SET is_tmax = TRUE,
        is_vip = TRUE,
        tmax_expires_at = NOW() + INTERVAL '1 year',
        updated_at = NOW()
    WHERE id = p_user_id;
    v_granted_tmax := TRUE;
    v_effective_tier := 'tmax';

  ELSE
    RETURN jsonb_build_object('ok', FALSE, 'message', '不支持的激活码类型');
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
      WHEN v_granted_tmax THEN '激活成功，已开通 TMAX 大会员权益'
      WHEN v_granted_pro THEN '激活成功，TPRO 进阶权限已生效'
      WHEN v_granted_base THEN '激活成功，BASI 基础权限已生效'
      ELSE '激活成功'
    END,
    'tier', v_code.tier,
    'is_tmax', v_granted_tmax,
    'is_vip', v_granted_pro OR v_granted_tmax,
    'is_base_vip', v_granted_base
  );
END;
$$;

-- 5. Helper function for TMAX usage increment
CREATE OR REPLACE FUNCTION public.increment_test_usage(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_profile public.profiles%ROWTYPE;
BEGIN
  SELECT * INTO v_profile FROM public.profiles WHERE id = p_user_id FOR UPDATE;
  
  -- If not TMAX, just return OK (they use codes per test)
  IF NOT v_profile.is_tmax THEN
    RETURN jsonb_build_object('ok', TRUE);
  END IF;
  
  -- Check if date changed
  IF v_profile.last_test_date IS NULL OR v_profile.last_test_date < CURRENT_DATE THEN
    UPDATE public.profiles 
    SET daily_test_count = 1, last_test_date = CURRENT_DATE 
    WHERE id = p_user_id;
    RETURN jsonb_build_object('ok', TRUE, 'count', 1);
  END IF;
  
  -- Check limit
  IF v_profile.daily_test_count >= 10 THEN
    RETURN jsonb_build_object('ok', FALSE, 'message', '大会员每日限额 10 次已用完，请明天再试');
  END IF;
  
  UPDATE public.profiles 
  SET daily_test_count = daily_test_count + 1 
  WHERE id = p_user_id;
  
  RETURN jsonb_build_object('ok', TRUE, 'count', v_profile.daily_test_count + 1);
END;
$$;

COMMIT;

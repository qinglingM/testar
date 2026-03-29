import * as postgres from "https://deno.land/x/postgres@v0.19.2/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const dbUrl = Deno.env.get("SUPABASE_DB_URL");
    if (!dbUrl) throw new Error("Missing DB URL secret");

    const pool = new postgres.Pool(dbUrl, 1, true);
    const connection = await pool.connect();

    // ULTIMATE ATOMIC PATCH SCRIPT FOR DB CONSTRAINTS & REDEMPTION & USAGE TIER RULES
    const sql = `
      BEGIN;

      -- 1. Eliminate Constraint Conflicts
      ALTER TABLE public.activation_redemptions DROP CONSTRAINT IF EXISTS activation_redemptions_effective_tier_valid;
      ALTER TABLE public.activation_redemptions ADD CONSTRAINT activation_redemptions_effective_tier_valid CHECK (effective_tier IN ('basi', 'tpro', 'tmax', 'base', 'pro', 'upgd'));
      
      ALTER TABLE public.activation_codes DROP CONSTRAINT IF EXISTS activation_codes_tier_valid;
      ALTER TABLE public.activation_codes ADD CONSTRAINT activation_codes_tier_valid CHECK (tier IN ('basi', 'upgd', 'tpro', 'tmax', 'base', 'pro'));

      -- 2. Create Universal Point of Truth for Registration (Per-Quiz Unlocks)
      CREATE OR REPLACE FUNCTION public.redeem_activation_code_v5(p_user_id UUID, p_code TEXT, p_quiz_id TEXT, p_context TEXT DEFAULT 'start')
      RETURNS JSONB
      LANGUAGE plpgsql SECURITY DEFINER AS $$
      DECLARE
        v_code RECORD;
        v_profile RECORD;
        v_msg TEXT := '激活成功';
        v_has_base BOOLEAN := false;
        v_is_vip BOOLEAN := false;
        v_is_tmax BOOLEAN := false;
      BEGIN
        SELECT * INTO v_code FROM public.activation_codes WHERE code = p_code FOR UPDATE;
        IF v_code IS NULL THEN RETURN jsonb_build_object('ok', false, 'message', '该激活码不存在或已下架'); END IF;
        IF v_code.status != 'active' THEN RETURN jsonb_build_object('ok', false, 'message', '该激活码暂不可用'); END IF;
        IF v_code.expires_at IS NOT NULL AND v_code.expires_at < now() THEN RETURN jsonb_build_object('ok', false, 'message', '该激活码已过期'); END IF;
        IF v_code.redeemed_count >= v_code.max_redemptions THEN RETURN jsonb_build_object('ok', false, 'message', '该激活码使用次数已达上限'); END IF;

        IF p_context = 'start' AND v_code.tier = 'upgd' THEN RETURN jsonb_build_object('ok', false, 'message', '升级码仅限在分析结果页使用'); END IF;
        IF p_context = 'upgrade' AND v_code.tier IN ('basi', 'tpro') THEN RETURN jsonb_build_object('ok', false, 'message', '基础分析码仅限在首页入口处使用'); END IF;

        SELECT * INTO v_profile FROM public.profiles WHERE id = p_user_id FOR UPDATE;
        v_is_tmax := COALESCE(v_profile.is_tmax, false);

        IF v_code.tier != 'tmax' AND p_quiz_id IS NULL THEN
           RETURN jsonb_build_object('ok', false, 'message', '普通兑换码必须指定目标测试项目');
        END IF;

        -- Check if already redeemed THIS specific code
        IF EXISTS (SELECT 1 FROM public.activation_redemptions WHERE activation_code_id = v_code.id AND user_id = p_user_id) THEN
          RETURN jsonb_build_object('ok', false, 'message', '您已经兑换过此补充包，无法重复获取');
        END IF;

        -- Check per-quiz privileges
        IF v_code.tier != 'tmax' THEN
           SELECT TRUE INTO v_has_base FROM public.activation_redemptions WHERE user_id = p_user_id AND effective_tier IN ('base', 'basi', 'upgd', 'pro', 'tpro') AND metadata->>'quiz_id' = p_quiz_id LIMIT 1;
           v_has_base := COALESCE(v_has_base, false);
           SELECT TRUE INTO v_is_vip FROM public.activation_redemptions WHERE user_id = p_user_id AND effective_tier IN ('pro', 'tpro', 'upgd') AND metadata->>'quiz_id' = p_quiz_id LIMIT 1;
           v_is_vip := COALESCE(v_is_vip, false);
        END IF;

        -- Business Logic unified block
        IF v_code.tier IN ('basi', 'base') THEN
          IF v_has_base OR v_is_tmax THEN RETURN jsonb_build_object('ok', false, 'message', '针对该测试，您已拥有基础或更高权限，无需使用此券'); END IF;
          v_has_base := true;
          v_msg := 'BASI 基础探测权限已解锁';
        ELSIF v_code.tier IN ('upgd', 'tpro', 'pro') THEN
          IF v_is_vip OR v_is_tmax THEN RETURN jsonb_build_object('ok', false, 'message', '您已处在 PRO 星流，无需重复升级使用'); END IF;
          IF v_code.tier = 'upgd' AND NOT v_has_base THEN RETURN jsonb_build_object('ok', false, 'message', '升级码需要基础身份作底层，请先获取 BASI'); END IF;
          v_is_vip := true;
          v_msg := 'TPRO 进阶数据分析引擎已为您接入';
        ELSIF v_code.tier = 'tmax' THEN
          IF v_is_tmax THEN RETURN jsonb_build_object('ok', false, 'message', '您已经是尊贵的 TMAX 大会员，无需重复充值'); END IF;
          v_is_tmax := true;
          v_msg := 'TMAX 大会员特权已点亮，您已获得每日10次专属免费运算频次';
        ELSE
          RETURN jsonb_build_object('ok', false, 'message', '未知的加密档案代码');
        END IF;

        -- DML Updates - Update tmax globally
        IF v_code.tier = 'tmax' THEN
          UPDATE public.profiles SET 
            is_tmax = true,
            updated_at = now() 
          WHERE id = p_user_id;
        END IF;
        
        UPDATE public.activation_codes SET redeemed_count = redeemed_count + 1 WHERE id = v_code.id;
        
        INSERT INTO public.activation_redemptions (activation_code_id, user_id, effective_tier, metadata) 
        VALUES (v_code.id, p_user_id, v_code.tier, jsonb_build_object('real_tier', v_code.tier, 'quiz_id', COALESCE(p_quiz_id, 'global')));

        RETURN jsonb_build_object(
          'ok', true, 
          'message', v_msg, 
          'tier', v_code.tier, 
          'is_tmax', v_is_tmax, 
          'is_vip', v_is_vip, 
          'is_base_vip', v_has_base
        );
      EXCEPTION WHEN OTHERS THEN
        RETURN jsonb_build_object('ok', false, 'message', '底层引擎写入错误: ' || SQLERRM);
      END;
      $$;

      GRANT EXECUTE ON FUNCTION public.redeem_activation_code_v5(UUID, TEXT, TEXT, TEXT) TO authenticated;

      -- 3. Singular Source of Truth for test usage limiting
      CREATE OR REPLACE FUNCTION public.increment_test_usage_v2(p_user_id UUID)
      RETURNS JSONB
      LANGUAGE plpgsql SECURITY DEFINER AS $$
      DECLARE
        v_profile RECORD;
        v_new_count INTEGER;
      BEGIN
        SELECT * INTO v_profile FROM public.profiles WHERE id = p_user_id FOR UPDATE;
        IF v_profile IS NULL THEN RETURN jsonb_build_object('ok', false, 'message', '账户连接失败'); END IF;
        
        -- Reset mechanism for "today": if null or yesterday, act as 0
        IF v_profile.last_test_date IS NULL OR (v_profile.last_test_date AT TIME ZONE 'Asia/Shanghai')::date < (now() AT TIME ZONE 'Asia/Shanghai')::date THEN
          v_profile.daily_test_count := 0;
        END IF;

        IF v_profile.is_tmax THEN
           -- TMAX logic explicitly checks usage count against boundary limit
           IF v_profile.daily_test_count >= 10 THEN
             RETURN jsonb_build_object('ok', false, 'message', '您的 TMAX 会员每日 10 次专属免费体检额度已用完，请明早再来');
           END IF;
        ELSE
           -- Provide strict wall for non-members who somehow trigger backend increment
           RETURN jsonb_build_object('ok', false, 'message', '该服务限 TMAX 大会员使用。');
        END IF;

        v_new_count := v_profile.daily_test_count + 1;
        
        UPDATE public.profiles SET 
          daily_test_count = v_new_count,
          last_test_date = now()
        WHERE id = p_user_id;
        
        RETURN jsonb_build_object('ok', true, 'message', '通信频段已开启', 'count', v_new_count);
      EXCEPTION WHEN OTHERS THEN
        RETURN jsonb_build_object('ok', false, 'message', '扣次服务运行异常: ' || SQLERRM);
      END;
      $$;
      
      GRANT EXECUTE ON FUNCTION public.increment_test_usage_v2(UUID) TO authenticated;

      COMMIT;
    `;

    await connection.queryObject(sql);
    connection.release();

    return new Response(JSON.stringify({ ok: true, message: "Database Patches Super-Deployed Atomically." }), { headers: corsHeaders, status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ ok: false, message: error.message }), { headers: corsHeaders, status: 500 });
  }
});

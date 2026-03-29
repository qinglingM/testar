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

    // ULTIMATE ATOMIC PATCH SCRIPT FOR DB CONSTRAINTS & REDEMPTION
    const sql = `
      BEGIN;

      -- 1. Eliminate Constraint Conflicts
      ALTER TABLE public.activation_redemptions DROP CONSTRAINT IF EXISTS activation_redemptions_effective_tier_valid;
      ALTER TABLE public.activation_redemptions ADD CONSTRAINT activation_redemptions_effective_tier_valid CHECK (effective_tier IN ('basi', 'tpro', 'tmax', 'base', 'pro', 'upgd'));
      
      ALTER TABLE public.activation_codes DROP CONSTRAINT IF EXISTS activation_codes_tier_valid;
      ALTER TABLE public.activation_codes ADD CONSTRAINT activation_codes_tier_valid CHECK (tier IN ('basi', 'upgd', 'tpro', 'tmax', 'base', 'pro'));

      -- 2. Create Universal Point of Truth for Registration
      CREATE OR REPLACE FUNCTION public.redeem_activation_code_v3(p_user_id UUID, p_code TEXT, p_context TEXT DEFAULT 'start')
      RETURNS JSONB
      LANGUAGE plpgsql SECURITY DEFINER AS $$
      DECLARE
        v_code RECORD;
        v_profile RECORD;
        v_msg TEXT := '激活成功';
        v_has_base BOOLEAN := false;
        v_is_vip BOOLEAN := false;
        v_is_tmax BOOLEAN := false;
        v_new_metadata JSONB;
        v_test_count INTEGER := 0;
      BEGIN
        SELECT * INTO v_code FROM public.activation_codes WHERE code = p_code FOR UPDATE;
        IF v_code IS NULL THEN RETURN jsonb_build_object('ok', false, 'message', '该激活码不存在或已下架'); END IF;
        IF v_code.status != 'active' THEN RETURN jsonb_build_object('ok', false, 'message', '该激活码不可用'); END IF;
        IF v_code.expires_at IS NOT NULL AND v_code.expires_at < now() THEN RETURN jsonb_build_object('ok', false, 'message', '该激活码已过期'); END IF;
        IF v_code.redeemed_count >= v_code.max_redemptions THEN RETURN jsonb_build_object('ok', false, 'message', '该激活码已被使用完毕'); END IF;

        IF p_context = 'start' AND v_code.tier = 'upgd' THEN RETURN jsonb_build_object('ok', false, 'message', '升级码仅限在测试结果页使用'); END IF;
        IF p_context = 'upgrade' AND v_code.tier IN ('basi', 'tpro') THEN RETURN jsonb_build_object('ok', false, 'message', '基础码仅限在首页入口处使用'); END IF;

        SELECT * INTO v_profile FROM public.profiles WHERE id = p_user_id FOR UPDATE;
        v_has_base := COALESCE((v_profile.metadata->>'is_base_vip')::boolean, false);
        v_is_vip := COALESCE(v_profile.is_vip, false);
        v_is_tmax := COALESCE(v_profile.is_tmax, false);
        v_test_count := COALESCE(v_profile.daily_test_count, 0);
        v_new_metadata := COALESCE(v_profile.metadata, '{}'::jsonb);

        IF EXISTS (SELECT 1 FROM public.activation_redemptions WHERE activation_code_id = v_code.id AND user_id = p_user_id) THEN
          RETURN jsonb_build_object('ok', false, 'message', '您已经兑换过此补充包，无法重复获取');
        END IF;

        IF v_code.tier IN ('basi', 'base') THEN
          IF v_has_base OR v_is_vip OR v_is_tmax THEN RETURN jsonb_build_object('ok', false, 'message', '您已拥有基础打底或更高权限，无需核销即可分析'); END IF;
          v_has_base := true;
          v_test_count := v_test_count + 1;
          v_msg := 'BASI 基础探测权限已解锁';
        ELSIF v_code.tier IN ('upgd', 'tpro', 'pro') THEN
          IF v_is_vip OR v_is_tmax THEN RETURN jsonb_build_object('ok', false, 'message', '您已处在 PRO 极客星流，无需重复升级'); END IF;
          IF v_code.tier = 'upgd' AND NOT v_has_base THEN RETURN jsonb_build_object('ok', false, 'message', '您没有 BASI 基础模型支撑，无法单独执行升级码，请先激活基础款'); END IF;
          v_is_vip := true;
          v_test_count := v_test_count + 3;
          v_msg := 'TPRO 进阶星流已接入，深度数据已开启运算';
        ELSIF v_code.tier = 'tmax' THEN
          v_is_tmax := true;
          v_is_vip := true;
          v_test_count := v_test_count + 10;
          v_msg := 'TMAX 大会员特权已点亮，无限畅游宇宙';
        ELSE
          RETURN jsonb_build_object('ok', false, 'message', '异星识别码（未知类型）');
        END IF;

        v_new_metadata := jsonb_set(v_new_metadata, '{is_base_vip}', to_jsonb(v_has_base));
        
        UPDATE public.profiles SET 
          is_vip = v_is_vip, 
          is_tmax = v_is_tmax, 
          daily_test_count = v_test_count,
          metadata = v_new_metadata, 
          updated_at = now() 
        WHERE id = p_user_id;
        
        UPDATE public.activation_codes SET redeemed_count = redeemed_count + 1 WHERE id = v_code.id;
        INSERT INTO public.activation_redemptions (activation_code_id, user_id, effective_tier, metadata) VALUES (v_code.id, p_user_id, v_code.tier, jsonb_build_object('real_tier', v_code.tier));

        COMMIT;
        
        RETURN jsonb_build_object(
          'ok', true, 
          'message', v_msg, 
          'tier', v_code.tier, 
          'is_tmax', v_is_tmax, 
          'is_vip', v_is_vip, 
          'is_base_vip', v_has_base,
          'daily_test_count', v_test_count
        );
      EXCEPTION WHEN OTHERS THEN
        ROLLBACK;
        RETURN jsonb_build_object('ok', false, 'message', '资料库核销崩溃: ' || SQLERRM);
      END;
      $$;

      GRANT EXECUTE ON FUNCTION public.redeem_activation_code_v3(UUID, TEXT, TEXT) TO authenticated;

      COMMIT;
    `;

    await connection.queryObject(sql);
    connection.release();

    return new Response(JSON.stringify({ ok: true, message: "Database Patches Super-Deployed Atomically." }), { headers: corsHeaders, status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ ok: false, message: error.message }), { headers: corsHeaders, status: 500 });
  }
});

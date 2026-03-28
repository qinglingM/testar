import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const authHeader = req.headers.get("Authorization");

    // CRITICAL: Return 200 even for config errors to debug
    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
      return new Response(
        JSON.stringify({ 
          ok: false, 
          message: `雲端環境變量缺失 (URL: ${!!supabaseUrl}, Anon: ${!!supabaseAnonKey}, Service: ${!!supabaseServiceRoleKey})` 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    if (!authHeader) {
      return new Response(
        JSON.stringify({ ok: false, message: "請先登錄後再激活" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const code = body.code?.toString().trim().toUpperCase();

    if (!code) {
      return new Response(
        JSON.stringify({ ok: false, message: "激活碼無效" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await userClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ ok: false, message: "登錄狀態已過期，請重登" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey);
    const { data, error: rpcError } = await adminClient.rpc("redeem_activation_code", {
      p_user_id: user.id,
      p_code: code,
    });

    if (rpcError) {
      return new Response(
        JSON.stringify({ 
          ok: false, 
          message: rpcError.message || "資料庫 RPC 執行出錯",
          detail: rpcError.details,
          hint: rpcError.hint
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    return new Response(
      JSON.stringify(data || { ok: false, message: "激活失敗" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );

  } catch (error) {
    // FORCE 200 return for ALL errors to prevent SDK interception
    const message = error instanceof Error ? error.message : "發生未知運行時異常";
    return new Response(
      JSON.stringify({ ok: false, message: `[EDGE_FATAL] ${message}` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  }
});

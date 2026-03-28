const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ZERO DEPENDENCY VERSION: Using native fetch for DB interactions
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const authHeader = req.headers.get("Authorization");

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return new Response(
        JSON.stringify({ ok: false, message: "雲端環境變量 SUPABASE_URL/SERVICE_KEY 缺失" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const code = body.code?.toString().trim().toUpperCase();

    if (!code) {
      return new Response(
        JSON.stringify({ ok: false, message: "激活码格式错误" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // 1. Get User ID from Authorization header using simple API call
    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { Authorization: authHeader || "", apikey: Deno.env.get("SUPABASE_ANON_KEY") || "" }
    });
    
    if (!userRes.ok) {
      return new Response(
        JSON.stringify({ ok: false, message: "用戶身份驗證未通過" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }
    
    const userData = await userRes.json();
    const userId = userData.id;

    // 2. Exec RPC via Native fetch to PostgREST
    const rpcRes = await fetch(`${supabaseUrl}/rest/v1/rpc/redeem_activation_code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseServiceRoleKey}`,
        "apikey": supabaseServiceRoleKey
      },
      body: JSON.stringify({
        p_user_id: userId,
        p_code: code
      })
    });

    const rpcData = await rpcRes.json();

    if (!rpcRes.ok) {
      return new Response(
        JSON.stringify({ ok: false, message: rpcData.message || "資料庫 RPC 調用異常" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    return new Response(
      JSON.stringify(rpcData || { ok: false, message: "激活不成功" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );

  } catch (error) {
    const message = error instanceof Error ? error.message : "運行時未知錯誤";
    return new Response(
      JSON.stringify({ ok: false, message: `[ZERO_DEP_FAIL] ${message}` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  }
});

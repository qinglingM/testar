import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // 1. Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // 2. Only allow POST
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ ok: false, message: "Method not allowed" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 405 }
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const authHeader = req.headers.get("Authorization");

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
      return new Response(
        JSON.stringify({ ok: false, message: "Supabase environment variables are missing" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // 3. Authenticate User
    if (!authHeader) {
      return new Response(
        JSON.stringify({ ok: false, message: "请先登录后再进行激活" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const code = body.code;

    if (!code || typeof code !== "string" || !code.trim()) {
      return new Response(
        JSON.stringify({ ok: false, message: "激活码格式不正确" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await userClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ ok: false, message: "登录态失效，请重新登录" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    // 4. Exec RPC with Admin Privileges
    const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey);
    const { data, error: rpcError } = await adminClient.rpc("redeem_activation_code", {
      p_user_id: user.id,
      p_code: code.trim(),
    });

    // CRITICAL: Handle RPC errors as 200 responses with status if they are business logic errors
    if (rpcError) {
      console.error("[RPC Error]", rpcError);
      return new Response(
        JSON.stringify({ 
          ok: false, 
          message: rpcError.message || "激活码核銷失敗，請聯繫客服",
          detail: rpcError.details 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 } // Return 200 so frontend can show message
      );
    }

    const payload = data || { ok: false, message: "激活失敗，激活碼可能已失效" };

    return new Response(
      JSON.stringify(payload),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );

  } catch (error) {
    console.error("[Server Error]", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    
    return new Response(
      JSON.stringify({ ok: false, message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const json = (body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", {
      headers: corsHeaders,
      status: 405,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error("Supabase environment variables are not configured");
    }

    const payload = await req.json();
    const email =
      typeof payload?.email === "string" ? payload.email.trim().toLowerCase() : "";
    const password = typeof payload?.password === "string" ? payload.password : "";
    const nickname =
      typeof payload?.nickname === "string" ? payload.nickname.trim() : "";

    if (!isValidEmail(email)) {
      return json({
        ok: false,
        message: "邮箱地址无效，请输入真实可用的邮箱",
      });
    }

    if (password.length < 6) {
      return json({
        ok: false,
        message: "密码不符合要求，请使用至少 6 位字符",
      });
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        nickname: nickname || email.split("@")[0],
      },
    });

    if (error) {
      const message = error.message.toLowerCase();

      if (
        message.includes("already registered") ||
        message.includes("already exists") ||
        message.includes("duplicate")
      ) {
        return json({
          ok: false,
          message: "这个邮箱已经注册过了，请直接登录",
        });
      }

      if (message.includes("password")) {
        return json({
          ok: false,
          message: "密码不符合要求，请使用至少 6 位字符",
        });
      }

      if (message.includes("email")) {
        return json({
          ok: false,
          message: "邮箱地址无效，请输入真实可用的邮箱",
        });
      }

      return json({
        ok: false,
        message: error.message || "注册失败，请稍后再试",
      });
    }

    return json({
      ok: true,
      userId: data.user?.id ?? null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "未知错误";

    return new Response(
      JSON.stringify({ ok: false, message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});

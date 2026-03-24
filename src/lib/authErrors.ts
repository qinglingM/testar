interface AuthErrorLike {
  code?: string;
  message?: string;
  status?: number;
}

type AuthAction = "login" | "signup";

export const isEmailRateLimitError = (error: AuthErrorLike | null | undefined) => {
  if (!error) return false;

  const code = error.code ?? "";
  const message = (error.message ?? "").toLowerCase();

  return (
    code === "over_email_send_rate_limit" ||
    message.includes("email rate limit exceeded")
  );
};

export const getAuthErrorMessage = (
  error: AuthErrorLike | null | undefined,
  action: AuthAction,
) => {
  const fallback =
    action === "signup" ? "注册失败，请稍后再试" : "登录失败，请检查邮箱和密码";

  if (!error) return fallback;

  const code = error.code ?? "";
  const message = (error.message ?? "").toLowerCase();

  if (isEmailRateLimitError(error)) {
    return "注册邮件发送过于频繁，请稍后再试";
  }

  if (
    code === "email_address_invalid" ||
    (message.includes("email address") && message.includes("is invalid"))
  ) {
    return "邮箱地址无效，请输入真实可用的邮箱";
  }

  if (
    code === "email_exists" ||
    code === "user_already_exists" ||
    message.includes("already registered") ||
    message.includes("already exists")
  ) {
    return "这个邮箱已经注册过了，请直接登录";
  }

  if (message.includes("email not confirmed")) {
    return action === "signup"
      ? "注册成功，请先前往邮箱完成验证后再登录"
      : "邮箱还没验证，请先去邮箱完成验证";
  }

  if (message.includes("invalid login credentials")) {
    return "邮箱或密码不正确";
  }

  if (message.includes("password")) {
    return "密码不符合要求，请使用至少 6 位字符";
  }

  if (message.includes("signup is disabled")) {
    return "当前站点暂时关闭了注册";
  }

  if (message.includes("failed to fetch") || message.includes("network")) {
    return "网络连接失败，请稍后重试";
  }

  return error.message || fallback;
};

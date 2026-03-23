import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, ArrowRight, Loader2, User, KeyRound, Sparkles, ChevronLeft, ShieldCheck, Zap, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useState, useMemo } from "react";
import { useQuizStore } from "@/store/useQuizStore";
import { getAuthErrorMessage } from "@/lib/authErrors";
import { toast } from "sonner";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isRegister, setIsRegister] = useState(false);
  const [step, setStep] = useState(1); // 1: Email, 2: Password, 3: Nickname (Register only)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const login = useQuizStore(state => state.login);
  const signUp = useQuizStore(state => state.signUp);

  // Computed next status
  const isEmailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), [email]);
  const isPasswordValid = useMemo(() => password.length >= 6, [password]);

  const handleNext = async () => {
    setHasError(false);
    if (isRegister) {
      if (step === 1) {
        if (isEmailValid) setStep(2);
        else { setHasError(true); toast.error("请输入正确的邮箱地址"); }
      } else if (step === 2) {
        if (isPasswordValid) setStep(3);
        else { setHasError(true); toast.error("密码长度至少为 6 位"); }
      } else if (step === 3) {
        if (nickname.trim()) handleFinalSubmit();
        else { setHasError(true); toast.error("请输入您的昵称"); }
      }
    } else {
      if (isEmailValid && isPasswordValid) {
        handleFinalSubmit();
      } else {
        setHasError(true);
        toast.error("邮箱或密码格式错误");
      }
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setHasError(false);
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true);
    try {
      if (isRegister) {
        const result = await signUp(email, password, nickname);

        if (result.requiresEmailConfirmation) {
          toast.success("注册成功，请先前往邮箱完成验证");
        } else {
          toast.success("注册成功！欢迎加入探测星");
        }
      } else {
        await login(email, password);
        toast.success("登录成功，欢迎回来");
      }
      onClose();
      resetState();
    } catch (error: any) {
      console.error(error);
      setHasError(true);
      toast.error(getAuthErrorMessage(error, isRegister ? "signup" : "login"));
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setStep(1);
    setEmail("");
    setPassword("");
    setNickname("");
    setIsRegister(false);
    setShowPassword(false);
    setHasError(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4 sm:p-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0A051C]/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ y: "100%", opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: "100%", opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 30, stiffness: 250 }}
            className="relative w-full max-w-md bg-background rounded-[2.5rem] p-8 pt-6 pb-12 shadow-2xl overflow-hidden border border-border/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-1.5">
                  {isRegister && step > 1 && (
                    <button onClick={handleBack} className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center mr-2"><ChevronLeft className="w-4 h-4" /></button>
                  )}
                  <h3 className="font-display font-black text-[10px] uppercase tracking-widest text-muted-foreground mr-2">
                    {isRegister ? `注册账户 STEP ${step}` : "账户登录"}
                  </h3>
                </div>
                <button onClick={onClose} className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center"><X className="w-5 h-5" /></button>
              </div>

              {/* Progress Indicator */}
              {isRegister && (
                <div className="flex items-center w-full gap-2 mb-10">
                   {[1, 2, 3].map((s) => (
                     <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= step ? 'bg-primary' : 'bg-muted'}`} />
                   ))}
                </div>
              )}

              <div className="min-h-[220px]">
                {!isRegister ? (
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-2xl font-display font-black mb-2">欢迎回来</h1>
                      <p className="text-xs text-muted-foreground">请输入邮箱与密码进行登录。</p>
                    </div>
                    <div className="space-y-4">
                      <div className="relative">
                        <input 
                          type="email"
                          placeholder="邮箱地址"
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); setHasError(false); }}
                          className={`w-full h-18 rounded-2xl pl-14 pr-6 bg-muted/40 border-2 outline-none transition-all font-bold ${hasError && !isEmailValid ? 'border-red-500 bg-red-50/10' : 'border-transparent focus:border-primary focus:bg-background'}`}
                        />
                        <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 ${hasError && !isEmailValid ? 'text-red-500' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"}
                          placeholder="密码"
                          value={password}
                          onChange={(e) => { setPassword(e.target.value); setHasError(false); }}
                          onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                          className={`w-full h-18 rounded-2xl pl-14 pr-12 bg-muted/40 border-2 outline-none transition-all font-bold ${hasError && !isPasswordValid ? 'border-red-500 bg-red-50/10' : 'border-transparent focus:border-primary focus:bg-background'}`}
                        />
                        <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 ${hasError && !isPasswordValid ? 'text-red-500' : 'text-muted-foreground'}`} />
                        <button onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {step === 1 && (
                      <>
                        <h1 className="text-2xl font-display font-black">你的邮箱</h1>
                        <div className="relative">
                          <input 
                            type="email"
                            placeholder="example@email.com"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setHasError(false); }}
                            className={`w-full h-18 rounded-2xl pl-14 pr-6 bg-muted/40 border-2 outline-none transition-all font-bold ${hasError && !isEmailValid ? 'border-red-500 bg-red-50/10' : 'border-transparent focus:border-primary focus:bg-background'}`}
                          />
                          <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 ${hasError && !isEmailValid ? 'text-red-500' : 'text-muted-foreground'}`} />
                        </div>
                      </>
                    )}
                    {step === 2 && (
                      <>
                        <h1 className="text-2xl font-display font-black">设置密码</h1>
                        <div className="relative">
                          <input 
                            type={showPassword ? "text" : "password"}
                            placeholder="至少 6 位"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setHasError(false); }}
                            className={`w-full h-18 rounded-2xl pl-14 pr-12 bg-muted/40 border-2 outline-none transition-all font-bold ${hasError && !isPasswordValid ? 'border-red-500 bg-red-50/10' : 'border-transparent focus:border-primary focus:bg-background'}`}
                          />
                          <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 ${hasError && !isPasswordValid ? 'text-red-500' : 'text-muted-foreground'}`} />
                          <button onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                        </div>
                      </>
                    )}
                    {step === 3 && (
                      <>
                        <h1 className="text-2xl font-display font-black">昵称</h1>
                        <div className="relative">
                          <input 
                            type="text"
                            placeholder="探测者昵称"
                            value={nickname}
                            onChange={(e) => { setNickname(e.target.value); setHasError(false); }}
                            className={`w-full h-18 rounded-2xl pl-14 pr-6 bg-muted/40 border-2 outline-none transition-all font-bold ${hasError && !nickname.trim() ? 'border-red-500 bg-red-50/10' : 'border-transparent focus:border-primary focus:bg-background'}`}
                          />
                          <User className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 ${hasError && !nickname.trim() ? 'text-red-500' : 'text-muted-foreground'}`} />
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              <button 
                onClick={handleNext}
                disabled={isLoading}
                className="w-full mt-10 h-16 rounded-3xl bg-primary text-white font-display font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-primary/20 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isRegister && step === 3 ? "立即注册" : isRegister ? "下一步" : "立即登录")}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>

              <div className="mt-8 text-center">
                <button 
                  onClick={() => { setIsRegister(!isRegister); setStep(1); setHasError(false); }}
                  className="text-[10px] font-black uppercase tracking-widest text-muted-foreground"
                >
                  {isRegister ? "已有账号？去登录" : "新用户？去注册"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;

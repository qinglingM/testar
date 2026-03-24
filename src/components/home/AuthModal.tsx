import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, ArrowRight, Loader2, User, KeyRound, Sparkles, ChevronLeft, ShieldCheck, Zap, Eye, EyeOff } from "lucide-react";
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
  
  const login = useQuizStore(state => state.login);
  const signUp = useQuizStore(state => state.signUp);

  // Computed next status
  const isEmailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), [email]);
  const isPasswordValid = useMemo(() => password.length >= 6, [password]);

  const handleNext = async () => {
    if (isRegister) {
      if (step === 1) {
        if (isEmailValid) setStep(2);
        else toast.error("请输入正确的邮箱地址");
      } else if (step === 2) {
        if (isPasswordValid) setStep(3);
        else toast.error("密码长度至少为 6 位");
      } else if (step === 3) {
        if (nickname.trim()) handleFinalSubmit();
        else toast.error("请输入您的昵称");
      }
    } else {
      // Login flow: Just submit
      if (isEmailValid && isPasswordValid) {
        handleFinalSubmit();
      } else {
        toast.error("邮箱或密码格式不正确");
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
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
  };

  // Progress Bar
  const totalSteps = isRegister ? 3 : 1;
  const progress = isRegister ? (step / totalSteps) * 100 : 100;

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
            className="relative w-full max-w-md bg-background rounded-[2.5rem] p-8 pt-6 pb-12 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] overflow-hidden border border-border/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none rounded-full -mr-32 -mt-32" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-1.5">
                  {isRegister && step > 1 && (
                    <button 
                      onClick={handleBack}
                      className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center mr-2 btn-press"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  )}
                  <h3 className="font-display font-black text-sm uppercase tracking-widest text-muted-foreground mr-2">
                    {isRegister ? `注册账户 STEP ${step}` : "账户登录"}
                  </h3>
                </div>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center btn-press"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Enhanced Progress Indicator with Nodes */}
              {isRegister && (
                <div className="flex items-center w-full gap-2 mb-10 mt-2">
                   {[1, 2, 3].map((s) => (
                     <div key={s} className="flex-1 flex items-center gap-2">
                        <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                          s <= step ? 'bg-primary shadow-[0_0_8px_rgba(239,68,68,0.3)]' : 'bg-muted'
                        }`} />
                        <div className={`w-3 h-3 rounded-full border-2 transition-all duration-500 shrink-0 ${
                          s <= step ? 'bg-primary border-primary scale-125' : 'bg-muted border-muted'
                        }`} />
                     </div>
                   ))}
                </div>
              )}

              <div className="min-h-[220px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {!isRegister ? (
                    <motion.div 
                      key="login-form"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="space-y-6"
                    >
                      <div>
                        <h1 className="text-[1.75rem] font-display font-black leading-tight mb-2">
                          欢迎登录
                        </h1>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          请输入您的电子邮箱与密码以同步测试报告。
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="relative group">
                          <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isEmailValid ? 'text-primary' : 'text-muted-foreground'}`}>
                             <Mail className="w-5 h-5" />
                          </div>
                          <input 
                            type="email"
                            placeholder="邮箱地址 (example@email.com)"
                            value={email}
                            onChange={(e) => setEmail(e.target.value.toLowerCase())}
                            className="w-full h-20 bg-muted/40 border-2 border-border/50 rounded-2xl pl-14 pr-6 font-display font-bold text-base focus:border-primary/30 focus:bg-background outline-none transition-all placeholder:text-muted-foreground/50"
                          />
                        </div>
                        <div className="relative group">
                          <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isPasswordValid ? 'text-primary' : 'text-muted-foreground'}`}>
                             <KeyRound className="w-5 h-5" />
                          </div>
                          <input 
                            type={showPassword ? "text" : "password"}
                            placeholder="请输入密码"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                            className="w-full h-20 bg-muted/40 border-2 border-border/50 rounded-2xl pl-14 pr-12 font-display font-bold text-base focus:border-primary/30 focus:bg-background outline-none transition-all placeholder:text-muted-foreground/50"
                          />
                          <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <>
                      {step === 1 && (
                        <motion.div 
                          key="reg-step-1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-6"
                        >
                          <div>
                            <h1 className="text-[1.75rem] font-display font-black leading-tight mb-2">
                              你的邮箱地址
                            </h1>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              用于找回账号与接收深度报告，请确保填写正确。
                            </p>
                          </div>
                          <div className="relative group">
                             <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isEmailValid ? 'text-primary' : 'text-muted-foreground'}`}>
                                <Mail className="w-5 h-5" />
                             </div>
                             <input 
                               type="email"
                               placeholder="example@email.com"
                               value={email}
                               onChange={(e) => setEmail(e.target.value.toLowerCase())}
                               onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                               className="w-full h-20 bg-muted/40 border-2 border-border/50 rounded-2xl pl-14 pr-6 font-display font-bold text-base focus:border-primary/30 focus:bg-background outline-none transition-all placeholder:text-muted-foreground/50"
                             />
                          </div>
                        </motion.div>
                      )}

                      {step === 2 && (
                        <motion.div 
                          key="reg-step-2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-6"
                        >
                          <div>
                            <h1 className="text-[1.75rem] font-display font-black leading-tight mb-2">
                              设置登录密码
                            </h1>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              设置至少 6 位密码。请务必牢记。
                            </p>
                          </div>
                          <div className="relative group">
                             <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isPasswordValid ? 'text-primary' : 'text-muted-foreground'}`}>
                                <KeyRound className="w-5 h-5" />
                             </div>
                             <input 
                               type={showPassword ? "text" : "password"}
                               placeholder="设置 6 位以上密码"
                               autoFocus
                               value={password}
                               onChange={(e) => setPassword(e.target.value)}
                               onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                               className="w-full h-20 bg-muted/40 border-2 border-border/50 rounded-2xl pl-14 pr-12 font-display font-bold text-base focus:border-primary/30 focus:bg-background outline-none transition-all placeholder:text-muted-foreground/50"
                             />
                             <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                              >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                          </div>
                        </motion.div>
                      )}

                      {step === 3 && (
                        <motion.div 
                          key="reg-step-3"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-6"
                        >
                          <div>
                            <h1 className="text-[1.75rem] font-display font-black leading-tight mb-2">
                              设置你的昵称
                            </h1>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                               最后一步测试，请问我们该如何称呼您？
                            </p>
                          </div>
                          <div className="relative group">
                             <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary">
                                <User className="w-5 h-5" />
                             </div>
                             <input 
                               type="text"
                               placeholder="请输入昵称"
                               autoFocus
                               value={nickname}
                               onChange={(e) => setNickname(e.target.value)}
                               onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                               className="w-full h-20 bg-muted/40 border-2 border-border/50 rounded-2xl pl-14 pr-6 font-display font-bold text-base focus:border-primary/30 focus:bg-background outline-none transition-all placeholder:text-muted-foreground/50"
                             />
                          </div>
                        </motion.div>
                      )}
                    </>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-10 flex justify-center w-full">
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  onClick={handleNext}
                  className="w-1/2 group relative h-16 rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/20 transition-all disabled:opacity-50 flex items-center justify-center p-4"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-red-500 to-indigo-600 animate-gradient-x" />
                  <div className="relative h-full w-full flex items-center justify-center gap-2 text-white font-display font-black text-lg uppercase tracking-widest">
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        {isRegister ? (step === 3 ? "立即注册" : "下一步") : "立即登录"}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </motion.button>
              </div>

              <div className="mt-8 text-center">
                <button 
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setStep(1);
                    setShowPassword(false);
                  }}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground"
                >
                  {isRegister ? "已有账号？" : "还没有账号？"}
                  <span className="text-primary ml-2 hover:text-primary/80 transition-colors">
                    {isRegister ? "去登录" : "去注册"}
                  </span>
                </button>
              </div>

              <div className="mt-10 pt-6 border-t border-border/10 flex flex-col items-center gap-2">
                 <p className="text-[9px] text-muted-foreground/40 text-center leading-relaxed max-w-[280px]">
                   登录即代表接受探测星的 <span className="underline">服务条款</span> 与 <span className="underline">隐私协议</span>
                 </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;

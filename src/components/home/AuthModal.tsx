import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { useQuizStore } from "@/store/useQuizStore";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1); // 1: Phone, 2: Code
  const [isLoading, setIsLoading] = useState(false);
  const login = useQuizStore(state => state.login);

  const handleSendCode = () => {
    if (phoneNumber.length === 11) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setStep(2);
      }, 1000);
    }
  };

  const handleVerify = () => {
    if (code.length === 4) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        login("探测星访客"); // Mock login name
        onClose();
      }, 1000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-background rounded-t-[2rem] sm:rounded-[2.5rem] p-8 pt-6 pb-12 shadow-2xl overflow-hidden"
          >
            {/* Grab handle */}
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-8 sm:hidden opacity-40" />

            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-display font-bold">欢迎回来</h2>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center btn-press"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {step === 1 ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">手机号码</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <input 
                        type="tel" 
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="请输入手机号"
                        maxLength={11}
                        className="w-full bg-muted/40 border-2 border-transparent focus:border-primary/20 focus:bg-background h-14 rounded-2xl pl-12 pr-4 outline-none transition-all font-display font-bold text-lg"
                      />
                    </div>
                  </div>

                  <button 
                    disabled={phoneNumber.length !== 11 || isLoading}
                    onClick={handleSendCode}
                    className="w-full h-14 bg-foreground text-background rounded-2xl font-display font-bold text-sm btn-press flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "获取验证码"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">验证码</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <input 
                        type="tel" 
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="请输入4位验证码"
                        maxLength={4}
                        className="w-full bg-muted/40 border-2 border-transparent focus:border-primary/20 focus:bg-background h-14 rounded-2xl pl-12 pr-4 outline-none transition-all font-display font-bold text-lg tracking-[0.5em]"
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground text-center mt-2">
                      验证码已发送至 {phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")}
                    </p>
                  </div>

                  <button 
                    disabled={code.length !== 4 || isLoading}
                    onClick={handleVerify}
                    className="w-full h-14 bg-primary text-white rounded-2xl font-display font-bold text-sm btn-press flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:scale-100"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "立即进入"}
                  </button>

                  <button 
                    onClick={() => setStep(1)}
                    className="w-full text-xs font-bold text-muted-foreground hover:text-foreground transition-colors py-2"
                  >
                    返回修改手机号
                  </button>
                </div>
              )}

              <div className="pt-4 flex items-center gap-3">
                <div className="flex-1 h-px bg-border/50" />
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">探测星用户准则</span>
                <div className="flex-1 h-px bg-border/50" />
              </div>

              <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
                登录即代表您同意 <span className="text-foreground underline decoration-primary/30 underline-offset-2">用户协议</span> 与 <span className="text-foreground underline decoration-primary/30 underline-offset-2">隐私政策</span>
                <br />
                账户数据将通过云端量子加密存储。
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;

import { motion, AnimatePresence } from "framer-motion";
import { Crown, Check, Zap, Sparkles, Key, Loader2, X, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useQuizStore } from "@/store/useQuizStore";
import { track } from "@/utils/analytics";
import { toast } from "sonner";

interface VipPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VipPricingModal = ({ isOpen, onClose }: VipPricingModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");
  const [success, setSuccess] = useState(false);
  const verifyCode = useQuizStore(state => state.verifyActivationCode);
  const user = useQuizStore(state => state.user);

  const handleVerify = async () => {
    if (!user) {
      toast.error("请先登录再进行激活");
      return;
    }

    if (!code.trim() || isLoading) return;

    setIsLoading(true);
    const ok = await verifyCode(code);
    
    track('verify_activation_code', { code, success: ok });

    if (ok) {
      setSuccess(true);
      toast.success("账户升级成功！尊享 VIP 权限已开启");
      setTimeout(() => {
        onClose();
        // Reset local state after close
        setTimeout(() => {
          setSuccess(false);
          setCode("");
          setIsLoading(false);
        }, 300);
      }, 2000);
    } else {
      toast.error("无效的激活码，请检查后重新输入");
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center p-4 sm:p-0">
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
            className="relative w-full max-w-md bg-background rounded-[2.5rem] p-8 pt-6 pb-12 shadow-2xl overflow-hidden"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center text-white shadow-lg shadow-yellow-400/20">
                  <Crown className="w-6 h-6 fill-white" />
                </div>
                <h2 className="text-xl font-display font-black tracking-tight text-foreground">激活 Pro 特权</h2>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center btn-press hover:bg-muted transition-colors"
                disabled={success}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {success ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-6"
                >
                  <div className="relative mb-6">
                    <motion.div 
                       animate={{ 
                         scale: [1, 1.1, 1],
                         rotate: [0, 5, -5, 0]
                       }}
                       transition={{ duration: 3, repeat: Infinity }}
                       className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-emerald-500/30"
                    >
                      <Check className="w-12 h-12" strokeWidth={3} />
                    </motion.div>
                    <motion.div 
                      animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -inset-4 border-2 border-emerald-500 rounded-full opacity-0"
                    />
                  </div>
                  <h3 className="text-2xl font-display font-black mb-2">欢迎加入 PRO 会员</h3>
                  <p className="text-sm text-muted-foreground opacity-80">您的特权已即时生效，正在返回...</p>
                </motion.div>
              ) : (
                <motion.div key="form" className="space-y-8">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <FeatureItem icon={Sparkles} label="深度报告" desc="无限次查看深度画像" />
                      <FeatureItem icon={Zap} label="智力引擎" desc="解锁量子分析模型" />
                      <FeatureItem icon={ShieldCheck} label="永久存档" desc="历史记录安全备份" />
                      <FeatureItem icon={Check} label="去广告" desc="纯净体验无干扰" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 ml-1">
                      Activation Code
                    </p>
                    <div className="relative group">
                      <input 
                        type="text"
                        placeholder="ENTER CODE HERE"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full bg-muted/30 border-2 border-border/50 rounded-2xl px-6 py-5 text-center font-display font-black tracking-[0.2em] text-xl focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-muted-foreground placeholder:tracking-normal placeholder:font-medium uppercase"
                        onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                      />
                      <Key className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                    </div>
                  </div>

                  <button 
                    onClick={handleVerify}
                    disabled={!code.trim() || isLoading}
                    className="w-full py-5 rounded-2xl bg-foreground text-background font-display font-black text-sm btn-press flex items-center justify-center gap-3 shadow-2xl hover:bg-black transition-all disabled:opacity-50 disabled:scale-95"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Zap className="w-4 h-4 fill-primary text-primary" />
                        立即激活 Pro 特权
                      </>
                    )}
                  </button>

                  <p className="text-center text-[10px] text-muted-foreground opacity-50 font-medium">
                    通过激活码激活，无需支付订阅费用 <br />
                    如有疑问请联系您的服务商获取激活码
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const FeatureItem = ({ icon: Icon, label, desc }: any) => (
  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-muted/30 border border-border/40 hover:border-primary/20 transition-colors group">
    <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
      <Icon className="w-5 h-5" />
    </div>
    <div className="flex flex-col">
      <p className="text-xs font-black text-foreground leading-tight mb-0.5">{label}</p>
      <p className="text-[9px] text-muted-foreground font-medium leading-none">{desc}</p>
    </div>
  </div>
);

export default VipPricingModal;

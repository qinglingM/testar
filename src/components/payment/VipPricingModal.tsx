import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Key, Crown, Zap, ShieldCheck, Check, ClipboardPaste } from "lucide-react";
import { useState } from "react";
import { useQuizStore } from "@/store/useQuizStore";
import { track } from "@/utils/analytics";
import { toast } from "sonner";
import { CenteredErrorModal } from "@/components/ui/CenteredErrorModal";

const SuccessCelebration = ({ show }: { show: boolean }) => (
  <AnimatePresence>
    {show && (
      <div className="fixed inset-0 z-[2000] flex items-center justify-center pointer-events-none">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-white/60 backdrop-blur-md"
        />
        <motion.div
           initial={{ scale: 0, rotate: -20, opacity: 0 }}
           animate={{ scale: [0, 1.2, 1], rotate: [0, 10, 0], opacity: 1 }}
           transition={{ duration: 0.8, ease: "backOut" }}
           className="relative flex flex-col items-center"
        >
           <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 mb-6">
              <Sparkles className="w-16 h-16 text-white" />
           </div>
           <motion.h2 
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.3 }}
             className="text-3xl font-display font-black text-primary tracking-widest"
           >
             激 活 成 功
           </motion.h2>
           <motion.p
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.4 }}
             className="text-muted-foreground font-bold mt-2 font-display"
           >
             欢迎来到深度探测纪元 · MAX
           </motion.p>
           {[...Array(16)].map((_, i) => (
             <motion.div
               key={i}
               initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
               animate={{ 
                 x: Math.cos(i * 22.5 * Math.PI / 180) * 200, 
                 y: Math.sin(i * 22.5 * Math.PI / 180) * 200,
                 opacity: 0,
                 scale: 1.5
               }}
               transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
               className="absolute top-16 left-1/2 w-3 h-3 bg-primary rounded-full"
             />
           ))}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

interface VipPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VipPricingModal = ({ isOpen, onClose }: VipPricingModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const verifyCode = useQuizStore(state => state.verifyActivationCode);
  const user = useQuizStore(state => state.user);

  const handleVerify = async () => {
    if (!user) {
      toast.error("请先登录再进行激活");
      return;
    }

    if (!code.trim() || isLoading) {
      return;
    }

    setIsLoading(true);
    const result = await verifyCode(code.trim());
    track('verify_activation_code', { code, success: result.ok, context: 'pricing_modal' });

    if (result.ok) {
        toast.success(result.message || "激活成功！MAX 权限已开启");
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setCode("");
          setIsLoading(false);
          onClose();
        }, 2200);
    } else {
      setErrorMessage(result.message || "您输入的激活码似乎并不在我们的星系中，请检查输入或寻找官方补给。");
      setShowErrorModal(true);
      setIsLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      if (!navigator.clipboard) {
        toast.error("浏览器不支持剪贴板访问");
        return;
      }
      const text = await navigator.clipboard.readText();
      if (text) {
        setCode(text.trim().toUpperCase());
        toast.success("已完成粘贴");
      } else {
        toast.info("剪贴板为空");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("直接从剪贴板读取失败，请手动输入");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            className="relative w-full max-w-md bg-background rounded-[3rem] overflow-hidden shadow-2xl border border-border/50"
          >
            {/* Header */}
            <div className="p-8 pb-4 flex items-center justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5"><Crown className="w-24 h-24" /></div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg shadow-yellow-400/20">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-black">MAX 全量升级</h2>
                  <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest opacity-50">Deep Insight Access</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center btn-press hover:bg-muted transition-colors relative z-10"
                disabled={showSuccess}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 pt-4">
              <div className="space-y-10">
                <div className="p-6 rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-background to-accent/5 border border-primary/10 shadow-inner">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">MAX Plan Features</span>
                    <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-sm font-bold text-foreground">
                      <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 text-emerald-600" />
                      </div>
                      解锁 3000 字专属深度分析画像
                    </li>
                    <li className="flex items-center gap-3 text-sm font-bold text-foreground">
                      <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 text-emerald-600" />
                      </div>
                      未来 5-10 年潜能演变路径指导
                    </li>
                    <li className="flex items-center gap-3 text-sm font-bold text-foreground">
                      <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 text-emerald-600" />
                      </div>
                      获取全量心理足迹与人群稀缺等级
                    </li>
                  </ul>
                </div>

                <div className="space-y-4 relative">
                  <div className="flex gap-2">
                     <div className="relative flex-1 group">
                       <input 
                         type="text"
                         placeholder="输入 MAX 激活码"
                         value={code}
                         onChange={(e) => setCode(e.target.value.toUpperCase())}
                         className="w-full h-22 bg-muted/40 border-2 border-border/50 rounded-3xl px-6 text-center font-display font-black tracking-[0.2em] text-xl focus:border-primary focus:bg-background focus:ring-8 focus:ring-primary/5 outline-none transition-all placeholder:text-muted-foreground/30 placeholder:tracking-normal placeholder:font-medium uppercase shadow-inner"
                         onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                       />
                       <Key className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground/20 group-focus-within:text-primary transition-colors pointer-events-none" />
                     </div>
                     <button 
                       onClick={handlePaste}
                       className="w-22 h-22 rounded-3xl bg-muted/40 border-2 border-border/50 flex items-center justify-center text-muted-foreground hover:bg-muted transition-all hover:text-primary active:scale-95 shadow-sm"
                       title="粘贴"
                     >
                       <ClipboardPaste className="w-8 h-8" />
                     </button>
                  </div>
                </div>

                <button 
                  onClick={handleVerify}
                  disabled={isLoading || !code.trim() || showSuccess}
                  className="w-full h-20 bg-primary text-white font-display font-black text-xl rounded-2xl shadow-2xl shadow-primary/30 btn-premium animate-gradient-x flex items-center justify-center gap-3 group disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Zap className="w-6 h-6 fill-white group-hover:scale-125 transition-transform" />
                      立即激活 MAX 权限
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-muted/30 p-8 flex flex-col items-center gap-2 border-t border-border/10">
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-40">
                PROUDLY POWERED BY TESTSAR ENGINE
              </p>
            </div>
          </motion.div>
        </div>
      )}
      <CenteredErrorModal 
        isOpen={showErrorModal} 
        onClose={() => setShowErrorModal(false)} 
        message={errorMessage} 
      />
      
      <SuccessCelebration show={showSuccess} />
    </AnimatePresence>
  );
};

export default VipPricingModal;

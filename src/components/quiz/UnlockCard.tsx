import { Lock, Sparkles, Loader2, ShieldCheck, Zap, BrainCircuit, Key, Check, ArrowUpCircle, ClipboardPaste } from "lucide-react";
import { CenteredErrorModal } from "@/components/ui/CenteredErrorModal";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { track } from "@/utils/analytics";
import { useParams } from "react-router-dom";
import { useQuizStore } from "@/store/useQuizStore";
import { toast } from "sonner";

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
           <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 mb-6 font-black text-white text-4xl">
              <Sparkles className="w-16 h-16" />
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
             className="text-muted-foreground font-bold mt-2"
           >
             欢迎来到深度探测纪元 · TESTSAR
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

interface UnlockCardProps {
  onUnlock: () => void;
  isUpgrade?: boolean;
}

const UnlockCard = ({ onUnlock, isUpgrade = false }: UnlockCardProps) => {
  const [isActivating, setIsActivating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [code, setCode] = useState("");
  const [success, setSuccess] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const verifyCode = useQuizStore(state => state.verifyActivationCode);
  const { slug } = useParams();

  const handleStartActivation = () => {
    setIsActivating(true);
    track('unlock_card_click', { quiz_id: slug, type: isUpgrade ? 'upgrade' : 'full' });
  };

  const handleVerify = async () => {
    if (!code.trim() || isVerifying) return;
    
    setIsVerifying(true);
    const ok = await verifyCode(code);
    
    track('verify_activation_code', { code, success: ok, type: isUpgrade ? 'upgrade' : 'full' });
    
    if (ok) {
      setSuccess(true);
      setTimeout(() => {
        onUnlock();
      }, 2200);
    } else {
      setErrorMessage("您输入的激活码似乎并不在我们的星系中，请检查输入或寻找官方补给。");
      setShowErrorModal(true);
      setIsVerifying(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setCode(text.trim().toUpperCase());
        toast.success("已从剪贴板粘贴");
      }
    } catch (err) {
      toast.error("粘贴失败，请手动输入");
    }
  };

  return (
    <>
      <motion.div 
        className={`glass-card relative overflow-hidden group border-primary/20 transition-all shadow-xl ${isUpgrade ? 'bg-gradient-to-br from-indigo-50/50 to-primary/5' : ''}`}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <AnimatePresence mode="wait">
          {!isActivating ? (
            <motion.div 
              key="id-pay"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-8 relative z-10 flex flex-col items-center text-center cursor-pointer"
              onClick={handleStartActivation}
            >
              <div className={`absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors ${isUpgrade ? 'bg-indigo-500/10' : 'bg-primary/10'}`} />
              
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-6 ring-8 transition-transform duration-500 group-hover:scale-110 ${isUpgrade ? 'bg-indigo-500 text-white ring-indigo-500/10' : 'bg-primary/10 text-primary ring-primary/5'}`}>
                {isUpgrade ? <ArrowUpCircle className="w-7 h-7" /> : <Lock className="w-6 h-6" />}
              </div>
              
              <h3 className="font-display font-black text-xl mb-3 text-foreground tracking-tight">
                {isUpgrade ? '特惠：解锁全量深度解析' : '解锁全量深度报告'}
              </h3>
              <p className="text-xs text-muted-foreground mb-8 leading-relaxed px-4 opacity-80">
                {isUpgrade 
                  ? '您的基础版测试已就绪。输入"补差价激活码"即可立即解锁完整 3000 字报告、未来建议及稀缺画像。' 
                  : '内含 3000 字专属灵魂解析、优劣势深度分析、未来 5 年发展建议及稀缺人群画像。'}
              </p>
              
              <div className={`w-1/2 mx-auto h-16 rounded-[2rem] btn-premium shadow-2xl flex items-center justify-center gap-3 ${isUpgrade ? 'animate-gradient-x' : ''}`}>
                <Key className="w-5 h-5 text-white" />
                <span className="text-lg font-black uppercase tracking-widest">{isUpgrade ? '立即解锁' : '激 活'}</span>
              </div>
              
              {isUpgrade && (
                <div className="mt-4 flex items-center gap-1.5 px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100/50">
                   <Sparkles className="w-3 h-3 text-indigo-500" />
                   <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest text-center">基础版用户专属福利：已减免 50%</span>
                </div>
              )}

              {!isUpgrade && (
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black mt-6 opacity-30 flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3" />
                  TESTSAR CRYPTOGRAPHY
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="id-unlocking"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="p-8 relative z-10 flex flex-col items-center text-center min-h-[280px] justify-center"
            >
               {success ? (
                 <motion.div 
                   initial={{ scale: 0.5, opacity: 0 }} 
                   animate={{ scale: 1, opacity: 1 }}
                   className="flex flex-col items-center"
                 >
                   <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                      <Sparkles className="w-10 h-10 animate-pulse" />
                   </div>
                   <h2 className="text-2xl font-black text-foreground mb-1">同步成功</h2>
                   <p className="text-xs text-muted-foreground italic">正在为您生成全量灵魂报告...</p>
                 </motion.div>
               ) : (
                 <>
                   <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
                     <Key className="w-6 h-6" />
                   </div>
                   
                   <h3 className="font-display font-black text-lg mb-4">输 入 激 活 码</h3>
                   <div className="w-full flex gap-2 mb-6">
                      <div className="relative flex-1 group">
                         <input 
                           type="text"
                           placeholder={isUpgrade ? "UP-XXXX-XXXX" : "XXXX-XXXX-XXXX"}
                           value={code}
                           onChange={(e) => setCode(e.target.value.toUpperCase())}
                           className="w-full h-18 bg-muted/30 border-2 border-border/50 rounded-2xl px-6 text-center font-display font-black tracking-[0.2em] text-xl focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-muted-foreground placeholder:tracking-normal placeholder:font-medium uppercase"
                           onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                         />
                         <Key className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                      </div>
                      <button 
                         onClick={handlePaste}
                         className="w-18 h-18 rounded-2xl bg-muted/40 border-2 border-border/50 flex items-center justify-center text-muted-foreground hover:bg-muted transition-all hover:text-primary active:scale-95"
                       >
                         <ClipboardPaste className="w-6 h-6" />
                       </button>
                   </div>

                   <button 
                    onClick={handleVerify}
                    disabled={!code.trim() || isVerifying}
                    className="w-1/2 mx-auto h-16 rounded-[2rem] btn-premium shadow-2xl animate-gradient-x disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-3"
                  >
                   {isVerifying ? (
                     <Loader2 className="w-6 h-6 animate-spin" />
                   ) : (
                     <>
                       <Zap className="w-5 h-5 fill-white text-white" />
                       <span className="text-lg font-black uppercase tracking-widest">激 活</span>
                     </>
                   )}
                 </button>
                 
                 <button 
                   onClick={() => setIsActivating(false)}
                   className="mt-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors"
                 >
                   返回上级
                 </button>
                 </>
               )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <CenteredErrorModal 
        isOpen={showErrorModal} 
        onClose={() => setShowErrorModal(false)} 
        message={errorMessage} 
      />
      
      <SuccessCelebration show={success} />
    </>
  );
};

export default UnlockCard;

import { Lock, Sparkles, Loader2, ShieldCheck, Zap, BrainCircuit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { track } from "@/utils/analytics";
import { useParams } from "react-router-dom";

interface UnlockCardProps {
  price?: string;
  originalPrice?: string;
  title?: string;
  description?: string;
  onUnlock: () => void;
}

const UnlockCard = ({ 
  price = "¥9.9",
  originalPrice = "¥29.9",
  title = "解锁完整深度报告",
  description = "获取属于你的 3000 字专属深度解析、优劣势分析及发展建议指南",
  onUnlock 
}: UnlockCardProps) => {
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [stage, setStage] = useState(0);

  const stages = [
    { text: "正在加密链路识别...", icon: ShieldCheck },
    { text: "正在链接云端分析模本...", icon: CloudIcon },
    { text: "正在合成深度报告参数...", icon: BrainCircuit },
    { text: "正在开启 VIP 权限通道...", icon: Zap },
  ];

  const { slug } = useParams();

  const handleUnlock = () => {
    if (isUnlocking) return;
    
    track('unlock_click', {
      quiz_id: slug || 'unknown',
      result_key: 'preview',
      entry_point: 'result_page'
    });

    setIsUnlocking(true);
    
    // Cycle through stages for "vibe"
    let s = 0;
    const interval = setInterval(() => {
      s++;
      if (s < stages.length) {
        setStage(s);
      } else {
        clearInterval(interval);
        onUnlock();
      }
    }, 600);
  };

  return (
    <motion.div 
      className="glass-card relative overflow-hidden group cursor-pointer border-primary/20 hover:border-primary/50 transition-colors"
      whileTap={isUnlocking ? {} : { scale: 0.98 }}
      onClick={handleUnlock}
    >
      <AnimatePresence mode="wait">
        {!isUnlocking ? (
          <motion.div 
            key="id-pay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 relative z-10 flex flex-col items-center text-center"
          >
            {/* 背景模糊渐变装饰 */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
            
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
              <Lock className="w-5 h-5" />
            </div>
            
            <h3 className="font-display font-bold text-lg mb-2 text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed px-2">
              {description}
            </p>
            
            <button className="w-full py-3.5 rounded-2xl bg-foreground text-background font-display font-bold text-sm btn-press flex items-center justify-center gap-2 shadow-lg mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              立即解锁 · {price}
              {originalPrice && (
                <span className="text-xs font-normal line-through opacity-60 ml-1 block mt-[2px]">{originalPrice}</span>
              )}
            </button>
            
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 opacity-70">
              <Lock className="w-3 h-3" />
              Secure Payment by TESTAR
            </p>
          </motion.div>
        ) : (
          <motion.div 
            key="id-unlocking"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 relative z-10 flex flex-col items-center text-center min-h-[220px] justify-center"
          >
             <motion.div
               animate={{ rotate: 360 }}
               transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
               className="mb-4"
             >
                <Loader2 className="w-10 h-10 text-primary" />
             </motion.div>
             
             <AnimatePresence mode="wait">
               <motion.div
                 key={stage}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="flex flex-col items-center"
               >
                  <div className="text-primary mb-2">
                    {(() => {
                        const Icon = stages[stage].icon;
                        return <Icon className="w-6 h-6" />
                    })()}
                  </div>
                  <p className="text-sm font-display font-bold text-foreground">
                    {stages[stage].text}
                  </p>
               </motion.div>
             </AnimatePresence>

             {/* Scanning line animation */}
             <motion.div 
               animate={{ top: ["0%", "100%", "0%"] }}
               transition={{ duration: 1.5, repeat: Infinity }}
               className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-20 shadow-[0_0_10px_primary]"
             />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Simple cloud icon fallback since lucide doesn't have CloudIcon specifically named in import usually
const CloudIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.5 19c.7 0 1.3-.2 1.8-.7s.7-1.1.7-1.8c0-1.4-1.1-2.5-2.5-2.5-.2 0-.4 0-.6.1C16 11.2 13.5 9 10.5 9c-2.8 0-5 2.2-5 5 0 .1 0 .2.1.3C4.2 14.5 3 15.6 3 17c0 1.7 1.3 3 3 3h11.5z"/>
  </svg>
);

export default UnlockCard;

import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Share2, Copy, Check, Lock } from "lucide-react";
import { useState } from "react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizTitle: string;
  resultTitle: string;
  gradeLabel: string;
}

export const ShareModal = ({ isOpen, onClose, quizTitle, resultTitle, gradeLabel }: ShareModalProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-background rounded-[2.5rem] overflow-hidden relative shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center btn-press z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Poster Preview Area */}
            <div className="p-8 pb-4 relative">
               <div className="aspect-[3/4] rounded-[2rem] gradient-primary p-6 flex flex-col justify-between text-white relative overflow-hidden shadow-inner transition-all duration-500">
                  {/* Decorative blobs */}
                  <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-white/20 blur-2xl rounded-full" />
                  <div className="absolute bottom-[-10%] left-[-10%] w-32 h-32 bg-black/10 blur-2xl rounded-full" />

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 mb-2 block">Premium Report</span>
                    <h3 className="text-2xl font-display font-extrabold leading-tight mb-1">
                      {quizTitle}
                    </h3>
                    <p className="text-xs opacity-70 italic">Verified by Testar Engine</p>
                  </div>

                  <div className="relative z-10 text-center py-4">
                    <div className="text-[10px] uppercase font-bold tracking-widest mb-2 opacity-80">My Soul Type</div>
                    <h2 className="text-4xl font-display font-black mb-2 shadow-text">
                        {resultTitle.split(' - ')[0]}
                    </h2>
                    <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-xs font-bold">
                        {gradeLabel}
                    </div>
                  </div>

                  <div className="flex items-end justify-between">
                    <div className="flex flex-col gap-1">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary font-bold shadow-xl">
                            TEST
                        </div>
                        <span className="text-[8px] font-medium opacity-60">扫描探索你的灵魂</span>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold tracking-tighter">WWW.TESTAR.AI</p>
                        <p className="text-[8px] opacity-40">All rights reserved © 2026</p>
                    </div>
                  </div>
               </div>
            </div>

            {/* Actions */}
            <div className="p-6 pt-4 grid grid-cols-2 gap-3">
               <button 
                 onClick={handleCopy}
                 className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold btn-press bg-muted text-foreground"
               >
                 {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                 {copied ? '已复制链接' : '复制暗号'}
               </button>
               <button 
                 className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold btn-press shadow-lg bg-foreground text-background"
               >
                 <Download className="w-4 h-4" />
                 保存海报
               </button>
            </div>
            
            <p className="text-center text-[10px] text-muted-foreground pb-6 opacity-60">
                保存后可分享至朋友圈或发送给好友
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

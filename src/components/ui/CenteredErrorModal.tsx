import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";

interface CenteredErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export const CenteredErrorModal = ({ isOpen, onClose, message }: CenteredErrorModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm bg-background/95 rounded-[2.5rem] p-10 text-center shadow-2xl overflow-hidden border border-red-500/10"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-red-400/30" />
            
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
               <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            
            <h3 className="text-xl font-display font-black text-red-600 mb-3">验证失败</h3>
            <p className="text-sm text-red-500/80 font-medium mb-10 leading-relaxed px-2">
              {message || "您输入的激活码似乎并不在我们的星系中，请检查输入或寻找官方补给。"}
            </p>
            
            <button 
              onClick={onClose}
              className="w-full py-5 rounded-2xl bg-red-50 text-red-600 font-black text-sm btn-press border border-red-100 shadow-sm"
            >
              我知道了
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

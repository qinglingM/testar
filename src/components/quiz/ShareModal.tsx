import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Copy, Check, Star } from "lucide-react";
import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import logoIcon from "@/assets/logo-icon.png";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizTitle: string;
  resultTitle: string;
  gradeLabel: string;
}

export const ShareModal = ({ isOpen, onClose, quizTitle, resultTitle, gradeLabel }: ShareModalProps) => {
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);
  const [posterImg, setPosterImg] = useState<string | null>(null);

  const shareText = `【探测星报告】暗号：我的灵魂类型是“${resultTitle.split(' - ')[0]}”，击败了全国 ${gradeLabel} 的用户。快来探测星(testar.ai)看看你的内在维度！`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast.success("灵魂暗号已存入剪贴板！");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("复制失败，请手动选择文字");
    }
  };

  const handleSave = async () => {
    if (!posterRef.current || saving) return;
    
    setSaving(true);
    const loadingToast = toast.loading("正在生成灵魂海报...");

    try {
      // 1. Wait a bit for layout to settle
      await new Promise(r => setTimeout(r, 200));

      // 2. Capture the element
      const canvas = await html2canvas(posterRef.current, {
        useCORS: true,
        scale: 4, // Higher quality (UHD)
        backgroundColor: "#0f172a", // Match slate-900 for safety
        logging: false,
        width: posterRef.current.offsetWidth,
        height: posterRef.current.offsetHeight,
        onclone: (clonedDoc) => {
           // Ensure cloned elements have correct positioning properties
           const clonedNode = clonedDoc.querySelector('[data-poster-body]') as HTMLElement;
           if (clonedNode) {
             clonedNode.style.borderRadius = '40px';
             clonedNode.style.overflow = 'hidden';
           }
        }
      });

      const dataUrl = canvas.toDataURL("image/png", 1.0);
      setPosterImg(dataUrl); // Show for long press
      
      // 3. For PC, trigger direct download
      const link = document.createElement("a");
      link.download = `testar-soul-poster-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      toast.dismiss(loadingToast);
      toast.success("海报已生成！若未自动下载，可长按预览图直接保存", {
        duration: 4000,
      });
    } catch (err) {
       console.error("Save poster error:", err);
       toast.dismiss(loadingToast);
       toast.error("生成海报失败，请稍后重试");
    } finally {
       setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-background/95 rounded-[3rem] overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
          >
            <button 
              onClick={onClose}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-muted/50 backdrop-blur-md flex items-center justify-center btn-press z-[60]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Poster Preview Area */}
            <div className="p-8 pb-4 relative">
               <div 
                 ref={posterRef}
                 data-poster-body="true"
                 style={{ aspectRatio: '3/4' }}
                 className="w-full rounded-[2.5rem] bg-slate-900 p-8 flex flex-col justify-between text-white relative overflow-hidden shadow-inner"
               >
                  {/* Premium Background Effects */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#020617] via-[#0f172a] to-[#1e1b4b]" />
                  <div className="absolute top-[-20%] right-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.15),transparent_60%)] animate-pulse-slow" />
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.08] mix-blend-overlay" />
                  
                  {/* Floating Highlights */}
                  <div className="absolute top-[10%] left-[10%] w-32 h-32 bg-primary/20 blur-[80px] rounded-full" />
                  <div className="absolute bottom-[10%] right-[10%] w-32 h-32 bg-accent/20 blur-[80px] rounded-full" />

                  <div className="relative z-10 flex justify-between items-start">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white/10 rounded-md border border-white/10 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-80">Authentic Report</span>
                      </div>
                      <h3 className="text-xl font-display font-black leading-tight mb-0.5 drop-shadow-xl">
                        {quizTitle}
                      </h3>
                      <p className="text-[10px] opacity-40 font-medium italic tracking-widest">Quantum Analytics v1.2</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-2 shadow-xl">
                       <img src={logoIcon} alt="" className="w-full h-full object-contain" />
                    </div>
                  </div>

                  <div className="relative z-10 flex flex-col items-center py-6 text-center">
                    <div className="text-[9px] uppercase font-black tracking-[0.4em] mb-4 opacity-40 text-primary">Identity Profile</div>
                    <h2 className="text-4xl font-display font-black mb-4 tracking-tighter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                        {resultTitle.split(' - ')[0]}
                    </h2>
                    <div className="inline-flex px-5 py-2.5 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 text-[11px] font-black shadow-2xl items-center gap-2 group">
                        <Star className="w-3.5 h-3.5 fill-primary text-primary group-hover:rotate-12 transition-transform" />
                        击败全网 <span className="text-primary">{gradeLabel}</span> 的用户
                    </div>
                  </div>

                  <div className="relative z-10 flex items-end justify-between border-t border-white/5 pt-6">
                    <div className="flex gap-4 items-center">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.3)] p-1.5 overflow-hidden ring-4 ring-white/5">
                           <QRCodeSVG 
                             value={window.location.origin} 
                             size={64}
                             level="Q"
                             imageSettings={{
                                src: logoIcon,
                                height: 14,
                                width: 14,
                                excavate: true
                             }}
                           />
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[9px] font-black tracking-widest leading-none mb-1 text-white">长按扫码</span>
                           <span className="text-[8px] opacity-40 font-medium text-slate-400 uppercase tracking-tighter">View Deep Insight</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[11px] font-black tracking-tighter text-primary italic">TESTAR</p>
                        <p className="text-[8px] opacity-20 italic font-medium leading-none mt-1">Deep Intelligence ✦</p>
                    </div>
                  </div>
               </div>

               {/* Overlaid Image for Long Press - Exact match for dimensions */}
               {posterImg && (
                 <div className="absolute inset-x-8 top-8 bottom-4 rounded-[2.5rem] overflow-hidden z-50 pointer-events-auto group">
                   <img 
                     src={posterImg} 
                     alt="Soul Poster" 
                     className="w-full h-full object-cover"
                   />
                   <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-6 text-center">
                      <Download className="w-8 h-8 text-white mb-3" />
                      <p className="text-white text-xs font-bold leading-relaxed">长按上方图片即可保存海报<br/><span className="text-[10px] opacity-60">Save to your gallery</span></p>
                   </div>
                 </div>
               )}
            </div>

            {/* Actions */}
            <div className="p-8 pt-4 grid grid-cols-2 gap-4">
               <button 
                 onClick={handleCopy}
                 className="flex items-center justify-center gap-2 py-4 rounded-2xl text-xs font-black uppercase tracking-widest btn-press bg-muted/50 text-foreground hover:bg-muted transition-colors border border-border/50"
               >
                 {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                 {copied ? 'Link Copied' : '魂号记录'}
               </button>
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className={`flex items-center justify-center gap-2 py-4 rounded-2xl text-xs font-black uppercase tracking-widest btn-press shadow-2xl transition-all ${
                    saving ? 'bg-muted text-muted-foreground' : 'bg-primary text-white'
                  }`}
                >
                  {saving ? <Check className="w-4 h-4 animate-pulse" /> : <Download className="w-4 h-4" />}
                  {saving ? 'Generating...' : '保存海报'}
                </button>
            </div>
            
            <p className="text-center text-[10px] text-muted-foreground pb-8 opacity-40 font-medium tracking-tight">
                ✧ 探测真我，从每一次交互开始 ✧
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Share2, RotateCcw, History, ChevronRight, ChevronLeft, Crown, Sparkles, ArrowRight, AlertTriangle, X } from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import Header from "@/components/layout/Header";
import ResultSummaryCard from "@/components/quiz/ResultSummaryCard";
import UnlockCard from "@/components/quiz/UnlockCard";
import { RelatedTestsBanner } from "@/components/quiz/RelatedTestsBanner";
import { useQuizStore } from "@/store/useQuizStore";
import { getQuizDef } from "@/data/registry";
import { track } from "@/utils/analytics";
import { toast } from "sonner";
import { ShareModal } from "@/components/quiz/ShareModal";

const QuizResultPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [showRetestConfirm, setShowRetestConfirm] = useState(false);
  const viewStartTime = useRef<number>(Date.now());

  // Load from store
  const finalResult = useQuizStore(state => state.finalResult);
  const dimensionPairs = useQuizStore(state => state.dimensionPairs);
  const answers = useQuizStore(state => state.answers);
  const isVip = useQuizStore(state => state.user?.isVip);
  const isBaseVip = useQuizStore(state => state.user?.isBaseVip);
  const quizDef = slug ? getQuizDef(slug) : null;

  useEffect(() => {
    if (!quizDef || !finalResult) {
       navigate('/');
    } else {
       track('result_free_view', {
         quiz_id: quizDef.id,
         result_key: finalResult.id || 'default',
         is_first_view: true
       });
    }
  }, [quizDef, finalResult, navigate, dimensionPairs]);

  if (!quizDef || !finalResult) {
    return <MobileLayout><div className="p-6">Loading...</div></MobileLayout>;
  }

  const currentResult = quizDef.results.find(r => r.id === finalResult.id) || finalResult;
  const cityBaseline = currentResult.cityBaseline;
  const professionalScores = useQuizStore.getState().professionalScores;

  const getAnswerDetail = (qId: string | number) => {
    const q = quizDef.questions.find(q => String(q.id) === String(qId));
    if (!q) return null;
    const ansIdx = answers[String(qId)];
    const opt = q.options[ansIdx as number];
    return { question: q.text, option: opt?.label, explanation: opt?.explanation };
  };

  return (
    <MobileLayout className="bg-muted/30">
      <div id="screenshot-area" className="relative pb-6 bg-background rounded-b-[2.5rem] shadow-sm overflow-hidden mb-6">
        <Header 
          title={quizDef?.title || "测试报告"} 
          transparent 
          rightElement={
            <button className="p-2 btn-press" onClick={() => setIsShareOpen(true)}>
              <Share2 className="w-5 h-5 text-foreground" />
            </button>
          }
        />
        
        <div className="px-5 mt-2">
          <ResultSummaryCard 
            title={currentResult.title}
            subtitle={currentResult.subtitle}
            dimensionPairs={dimensionPairs}
            chartType={quizDef.visualization === 'radar' ? 'radar' : 'spectrum'}
            dimensions={quizDef.dimensions.map(d => ({ ...d, colorClass: d.colorClass || 'bg-primary' }))}
            scores={professionalScores}
            cityBaseline={typeof currentResult.cityBaseline === 'object' ? currentResult.cityBaseline : undefined}
          />

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`mt-6 p-4 rounded-2xl border flex items-center justify-between ${isVip ? 'bg-primary/10 border-primary/20' : 'bg-secondary/20 border-secondary/30'}`}
          >
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                {isVip ? '深度人才数据扫描' : '初步画像识别'}
              </span>
              <p className="text-xs text-foreground/80 font-medium">
                {isVip 
                  ? '已对接全库千万级样本比对。' 
                  : `你的特质在人群中占比约 ${(useQuizStore.getState().rarity || 5).toFixed(1)}%`}
              </p>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[10px] ${isVip ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
               {isVip ? <Crown className="w-4 h-4" /> : 'Free'}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="px-5 space-y-8 pb-24">
        <div className="glass-card p-5 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6 relative">
            <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary rounded-r-lg shadow-sm" />
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm">
               <History className="w-5 h-5" />
            </div>
            <div>
               <h3 className="font-display font-black text-[1.1rem] text-foreground tracking-tight leading-none text-left">
                 心理足迹 Preview
               </h3>
               <div className="h-1 w-8 bg-primary/20 rounded-full mt-2" />
            </div>
          </div>
          
          <div className="space-y-5">
            {Object.keys(answers).slice(0, isVip ? 10 : 3).map((qId, idx) => {
              const detail = getAnswerDetail(qId);
              if (!detail) return null;
              return (
                <div key={qId} className="relative pl-6 border-l border-border/50">
                  <div className="absolute left-[-4.5px] top-1.5 w-2 h-2 rounded-full bg-primary" />
                  <p className="text-[11px] text-muted-foreground mb-1">关键探测点 {idx + 1}</p>
                  <p className="text-xs text-foreground font-bold mb-1 leading-relaxed line-clamp-1">
                    {detail.question}
                  </p>
                  <p className="text-[10px] text-primary font-medium opacity-70">
                    选择：{detail.option}
                  </p>
                </div>
              );
            })}
          </div>
          
          <div className="mt-5 pt-4 border-t border-dashed flex items-center justify-between">
             <p className="text-[10px] text-muted-foreground font-medium">
               {isVip 
                 ? `已回溯全部 ${Object.keys(answers).length} 项探测足迹` 
                 : `剩余 ${Object.keys(answers).length - 3} 项待解锁...`}
             </p>
             <button 
               onClick={() => {
                 const dwellTime = (Date.now() - viewStartTime.current) / 1000;
                 if (quizDef && finalResult) {
                    track('result_free_view', {
                      quiz_id: quizDef.id,
                      result_key: finalResult.id || 'default',
                      is_first_view: false,
                      dwell_time: dwellTime
                    });
                 }

                 if (isVip) {
                   navigate(`/quiz/${slug}/report`);
                 } else {
                   const unlockCard = document.getElementById('unlock-section');
                   if (unlockCard) {
                     unlockCard.scrollIntoView({ behavior: 'smooth' });
                     toast.info("请解锁深度报告以查看全部足迹");
                   } else {
                     navigate(`/quiz/${slug}/report`);
                   }
                 }
               }}
               className="text-[10px] font-bold text-primary flex items-center gap-0.5"
             >
               {isVip ? '查看全部分析' : '立即解锁'} <ChevronRight className="w-3 h-3" />
             </button>
          </div>
        </div>

        <div id="unlock-section" className="relative overflow-hidden rounded-3xl group">
          <div className="flex items-center gap-3 mb-6 relative px-1">
            <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary rounded-r-lg shadow-sm" />
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm">
               <Sparkles className="w-5 h-5" />
            </div>
            <div>
               <h3 className="font-display font-black text-[1.1rem] text-foreground tracking-tight leading-none text-left">
                 专属深度分析
               </h3>
               <div className="h-1 w-8 bg-primary/20 rounded-full mt-2" />
            </div>
          </div>
          
          {isVip ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 flex flex-col items-center text-center bg-primary/5 border-primary/20"
            >
               <div className="w-16 h-16 bg-primary text-white rounded-3xl flex items-center justify-center mb-6 shadow-xl ring-8 ring-primary/5">
                  <Sparkles className="w-8 h-8 fill-white" />
               </div>
               <h3 className="font-display font-black text-xl mb-3">深度分析已就绪</h3>
               <p className="text-xs text-muted-foreground mb-8 leading-relaxed max-w-[240px]">
                 核心潜能库、避坑指南、灵魂交互建议等 3000 字专属深度内容已为您同步。
               </p>
               <button 
                 onClick={() => navigate(`/quiz/${slug}/report`)}
                 className="w-full py-4 rounded-2xl bg-foreground text-background font-display font-bold text-sm btn-press flex items-center justify-center gap-2 shadow-2xl hover:bg-black transition-colors"
               >
                 立即进入深度报告 <ArrowRight className="w-4 h-4" />
               </button>
            </motion.div>
          ) : (
            <>
              <div className="absolute inset-0 top-10 flex flex-col gap-4 opacity-40 blur-[8px] select-none pointer-events-none px-4">
                 <div className="h-4 w-3/4 bg-muted rounded-full" />
                 <div className="h-4 w-full bg-muted rounded-full" />
                 <div className="h-4 w-5/6 bg-muted rounded-full" />
                 <div className="h-4 w-2/3 bg-muted rounded-full" />
                 <div className="h-20 w-full bg-muted rounded-2xl" />
                 <div className="h-4 w-full bg-muted rounded-full" />
                 <div className="h-4 w-1/2 bg-muted rounded-full" />
              </div>

              <UnlockCard 
                isUpgrade={isBaseVip}
                onUnlock={() => {
                  const dwellTime = (Date.now() - viewStartTime.current) / 1000;
                  if (quizDef && finalResult) {
                    track('result_free_view', {
                      quiz_id: quizDef.id,
                      result_key: finalResult.id || 'default',
                      is_first_view: false,
                      dwell_time: dwellTime
                    });
                  }
                  navigate(`/quiz/${slug}/report`);
                }} 
              />
            </>
          )}
        </div>

        <RelatedTestsBanner />

        <div className="flex gap-4">
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-3.5 rounded-2xl bg-card border shadow-sm text-foreground font-medium text-sm btn-press flex items-center justify-center gap-2"
            onClick={() => setIsShareOpen(true)}
          >
            <Share2 className="w-4 h-4 text-muted-foreground" />
            分享此页
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-3.5 rounded-2xl bg-card border shadow-sm text-foreground font-medium text-sm btn-press flex items-center justify-center gap-2"
            onClick={() => setShowRetestConfirm(true)}
          >
            <RotateCcw className="w-4 h-4 text-muted-foreground" />
            再测一次
          </motion.button>
        </div>
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/history')}
            className="text-xs font-bold text-muted-foreground flex items-center justify-center gap-2 mx-auto py-2 px-4 hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> 返回我的探测记录
          </button>
        </div>
      </div>
      
      <ShareModal 
        isOpen={isShareOpen} 
        onClose={() => setIsShareOpen(false)}
        quizTitle={quizDef.title}
        resultTitle={currentResult.title}
        gradeLabel={(useQuizStore.getState().rarity || 5).toFixed(1) + "%"}
      />

      {/* Retest Confirmation Modal */}
      <AnimatePresence>
        {showRetestConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setShowRetestConfirm(false)}
               className="absolute inset-0 bg-black/60 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
               className="relative w-full max-w-xs bg-background rounded-[2rem] p-8 shadow-2xl text-center"
             >
                <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                   <AlertTriangle className="w-7 h-7" />
                </div>
                <h3 className="font-display font-black text-lg mb-3">确定要重新测试吗？</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-8">
                  激活码仅支持<span className="text-foreground font-bold">单次有效测试</span>。由于结果是唯一的，重新测试将覆盖当前结果，且需消耗新的激活码。
                </p>
                <div className="space-y-3">
                  <button 
                    onClick={() => navigate(`/quiz/${slug}`)}
                    className="w-full py-3.5 rounded-xl bg-foreground text-background font-display font-bold text-xs btn-press"
                  >
                    确定，去获取新激活码
                  </button>
                  <button 
                    onClick={() => setShowRetestConfirm(false)}
                    className="w-full py-3.5 rounded-xl bg-muted text-foreground font-display font-bold text-xs btn-press"
                  >
                    取消，保留结果
                  </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MobileLayout>
  );
};

export default QuizResultPage;

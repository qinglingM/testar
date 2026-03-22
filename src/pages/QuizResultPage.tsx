import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Share2, RotateCcw, History, ChevronRight } from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import Header from "@/components/layout/Header";
import ResultSummaryCard from "@/components/quiz/ResultSummaryCard";
import UnlockCard from "@/components/quiz/UnlockCard";
import { RelatedTestsBanner } from "@/components/quiz/RelatedTestsBanner";
import { useQuizStore } from "@/store/useQuizStore";
import { getQuizDef } from "@/data/registry";
import { track } from "@/utils/analytics";

const QuizResultPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const viewStartTime = useRef<number>(Date.now());

  // Load from store
  const finalResult = useQuizStore(state => state.finalResult);
  const dimensionPairs = useQuizStore(state => state.dimensionPairs);
  const answers = useQuizStore(state => state.answers);
  const quizDef = slug ? getQuizDef(slug) : null;

  useEffect(() => {
    // If user refreshes on Result page without a valid result in store, bump them home
    if (!quizDef || !finalResult || dimensionPairs.length === 0) {
       navigate('/');
    } else {
       track('result_free_view', {
         quiz_id: quizDef.id,
         result_key: finalResult.id || 'default',
         is_first_view: true // Simplified for now
       });
    }
  }, [quizDef, finalResult, navigate, dimensionPairs]);

  if (!quizDef || !finalResult) {
    return <MobileLayout><div className="p-6">Loading...</div></MobileLayout>;
  }

  const getAnswerDetail = (qId: string | number) => {
    const q = quizDef.questions.find(q => String(q.id) === String(qId));
    if (!q) return null;
    const ansIdx = answers[String(qId)];
    const opt = q.options[ansIdx as number];
    return { question: q.text, option: opt?.label, explanation: opt?.explanation };
  };

  return (
    <MobileLayout className="bg-muted/30">
      {/* 
        This wrapper is designed to be the "Screenshot Area". 
        It has no bottom sticky buttons interrupting the visual flow. 
      */}
      <div id="screenshot-area" className="relative pb-6 bg-background rounded-b-[2.5rem] shadow-sm overflow-hidden mb-6">
        <Header 
          title="你的测试报告" 
          transparent 
          rightElement={
            <button className="p-2 btn-press" onClick={() => {}}>
              <Share2 className="w-5 h-5 text-foreground" />
            </button>
          }
        />
        
        <div className="px-5 mt-2">
          <ResultSummaryCard 
            title={finalResult.title}
            subtitle={finalResult.subtitle}
            dimensionPairs={dimensionPairs}
            chartType={quizDef.visualization === 'radar' ? 'radar' : 'spectrum'}
            dimensions={quizDef.dimensions}
            scores={useQuizStore.getState().professionalScores}
          />

          {/* New: Community/Population Preview for Free Users */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 rounded-2xl bg-secondary/20 border border-secondary/30 flex items-center justify-between"
          >
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                初步人群画像识别
              </span>
              <p className="text-xs text-foreground/80 font-medium">
                你的特质属于人群中占比约 <span className="text-primary font-black">{(useQuizStore.getState().rarity || 5).toFixed(1)}%</span> 的群体
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px]">
               Free
            </div>
          </motion.div>
        </div>
      </div>

      <div className="px-5 space-y-8 pb-24">
        {/* Footprint Preview (Only 3 for free users) */}
        <div className="glass-card p-5 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-5">
             <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
               <History className="w-4 h-4" />
             </div>
             <h3 className="font-display font-black text-xs text-foreground uppercase tracking-widest">
               心理足迹 Preview
             </h3>
          </div>
          
          <div className="space-y-5">
            {Object.keys(answers).slice(0, 3).map((qId, idx) => {
              const detail = getAnswerDetail(qId);
              if (!detail) return null;
              return (
                <div key={qId} className="relative pl-6 border-l border-border/50">
                  <div className="absolute left-[-4.5px] top-1.5 w-2 h-2 rounded-full bg-primary" />
                  <p className="text-[11px] text-muted-foreground mb-1">关键探测点 {idx + 1}</p>
                  <p className="text-xs text-foreground font-bold mb-1 leading-relaxed line-clamp-1">
                    {detail.question}
                  </p>
                  <p className="text-[10px] text-primary font-medium italic opacity-70">
                    选择：{detail.option}
                  </p>
                </div>
              );
            })}
          </div>
          
          <div className="mt-5 pt-4 border-t border-dashed flex items-center justify-between">
             <p className="text-[10px] text-muted-foreground font-medium">剩余 {Object.keys(answers).length - 3} 项足印深度解析待解锁...</p>
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
                 navigate(`/quiz/${slug}/report`);
               }}
               className="text-[10px] font-bold text-primary flex items-center gap-0.5"
             >
               立即解锁 <ChevronRight className="w-3 h-3" />
             </button>
          </div>
        </div>

        {/* Paywall / Unlock Section */}
        <div className="relative overflow-hidden rounded-3xl group">
          <h3 className="font-display font-bold text-sm mb-3 pl-1 flex items-center gap-2 text-foreground">
            <span className="w-1.5 h-4 bg-primary rounded-full block" />
            专属深度分析
          </h3>
          
          {/* Blurred Preview Content */}
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
        </div>

        {/* Related Tests Rolling Banner */}
        <RelatedTestsBanner />

        {/* Secondary Actions */}
        <div className="flex gap-4">
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-3.5 rounded-2xl bg-card border shadow-sm text-foreground font-medium text-sm btn-press flex items-center justify-center gap-2"
            onClick={() => {}} // In real app, trigger share sheet or html2canvas
          >
            <Share2 className="w-4 h-4 text-muted-foreground" />
            分享此页
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-3.5 rounded-2xl bg-card border shadow-sm text-foreground font-medium text-sm btn-press flex items-center justify-center gap-2"
            onClick={() => navigate(`/quiz/${slug}`)}
          >
            <RotateCcw className="w-4 h-4 text-muted-foreground" />
            再测一次
          </motion.button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default QuizResultPage;

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Share2, ArrowLeft, Heart, Zap, Briefcase, 
  AlertCircle, Lightbulb, History, Compass, ChevronRight, RotateCcw, Star, Sparkles, User, Target, BarChart3, AlertTriangle
} from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import Header from "@/components/layout/Header";
import { ShareModal } from "@/components/quiz/ShareModal";
import { RelatedTestsBanner } from "@/components/quiz/RelatedTestsBanner";
import { useQuizStore } from "@/store/useQuizStore";
import { getQuizDef } from "@/data/registry";
import { track } from "@/utils/analytics";
import ResultSummaryCard from "@/components/quiz/ResultSummaryCard";
import QuizCard from "@/components/quiz/QuizCard"; // Added import for QuizCard

// Report Block Component
const ReportBlock = ({ title, icon: Icon, children, delay = 0 }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="glass-card overflow-hidden mb-6"
  >
    <div className="bg-muted/50 px-5 py-3.5 flex items-center gap-2 border-b">
      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
        <Icon className="w-3.5 h-3.5" />
      </div>
      <h3 className="font-display font-bold text[0.95rem] text-foreground tracking-wide">{title}</h3>
    </div>
    <div className="p-5 text-sm leading-relaxed text-muted-foreground space-y-3">
      {children}
    </div>
  </motion.div>
);

const QuizReportPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [showRetestConfirm, setShowRetestConfirm] = useState(false);

  const finalResult = useQuizStore(state => state.finalResult);
  const quizDef = slug ? getQuizDef(slug) : null;
  const answers = useQuizStore(state => state.answers);
  const loadReportFromHistory = useQuizStore(state => state.loadReportFromHistory);
  const rarity = useQuizStore(state => state.rarity);
  const synergyTags = useQuizStore(state => state.synergyTags);
  const dimensionPairs = useQuizStore(state => state.dimensionPairs);
  const isBalanced = useQuizStore(state => state.isBalanced);
  const dominantTraits = useQuizStore(state => state.dominantTraits);
  const coreAdvantages = useQuizStore(state => state.coreAdvantages);
  const professionalScores = useQuizStore(state => state.professionalScores);
  const isVip = useQuizStore(state => state.isVip);
  const careerTips = useQuizStore(state => (state as any).careerTips);
  const relationshipAdvice = useQuizStore(state => (state as any).relationshipAdvice);

  useEffect(() => {
    if (!quizDef || !finalResult) {
       navigate('/');
       return;
    } 

    if (!isVip) {
       navigate(`/quiz/${slug}/result`);
       return;
    }

    track('report_full_view', {
      quiz_id: quizDef.id,
      result_key: finalResult.id || 'default',
      entry_type: 'purchase'
    });
  }, [quizDef, finalResult, navigate, answers, isVip, slug]);

  if (!quizDef || !finalResult) {
    return <MobileLayout><div className="p-6">Loading...</div></MobileLayout>;
  }

  // Ensure we have the latest cityBaseline even if the stored result is stale
  const currentResult = quizDef.results.find(r => r.id === finalResult.id) || finalResult;
  const cityBaseline = currentResult.cityBaseline;

  const getAnswerDetail = (qId: string | number) => {
    const q = quizDef.questions.find(q => String(q.id) === String(qId));
    if (!q) return null;
    const ansIdx = answers[String(qId)];
    const opt = q.options[ansIdx as number];
    return { question: q.text, option: opt?.label, explanation: opt?.explanation };
  };

  const getFootprintCount = (qCount: number) => {
    if (qCount < 10) return 3;
    if (qCount < 15) return 5;
    return 7;
  };

  const isPopulation = quizDef.reportConfig?.topCardType === 'population';

  const getRarityGrade = (r: number) => {
    if (isPopulation) {
      if (r <= 3) return { label: '极度小众', color: 'bg-red-500/20 text-red-600 border-red-500/30' };
      if (r <= 8) return { label: '独特物种', color: 'bg-red-400/20 text-red-600 border-red-400/30' };
      if (r <= 12) return { label: '中坚力量', color: 'bg-red-300/20 text-red-500 border-red-300/30' };
      return { label: '大众基石', color: 'bg-red-200/20 text-red-500 border-red-200/30' };
    }
    if (r <= 2) return { label: 'SSR级 降临者', color: 'bg-red-600/20 text-red-600 border-red-600/30' };
    if (r <= 5) return { label: 'SR级 进化者', color: 'bg-red-500/20 text-red-500 border-red-500/30' };
    if (r <= 10) return { label: 'S级 独立波段', color: 'bg-red-400/20 text-red-400 border-red-400/30' };
    if (r <= 18) return { label: 'A级 能量锚点', color: 'bg-red-300/20 text-red-300 border-red-300/30' };
    return { label: 'B级 核心原形', color: 'bg-red-200/20 text-red-300 border-red-200/30' };
  };

  const grade = getRarityGrade(rarity);

  return (
    <MobileLayout>
      <Header 
        title="深度探测报告" 
        onBack={() => navigate('/history')}
        rightElement={
          <button className="p-2 btn-press" onClick={() => setIsShareOpen(true)}>
            <Share2 className="w-5 h-5 text-foreground" />
          </button>
        }
      />
      
      <div className="px-6 pt-8 pb-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
        
        <div className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-500 mb-5 border border-red-200">
          ✓ [假] 已解锁全部私人定制内容
        </div>
        
        <h1 className="font-display font-extrabold text-[1.8rem] leading-tight text-foreground mb-2 whitespace-pre-wrap">
          {currentResult.title}
        </h1>
        
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {currentResult.cityTags ? (
             currentResult.cityTags.map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-lg border border-emerald-100 uppercase tracking-wider">
                  #{tag}
                </span>
             ))
          ) : (
            synergyTags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-lg border border-primary/20 uppercase tracking-wider">
                {tag.title}
              </span>
            ))
          )}
        </div>

        {/* Modular Top Card: Rarity or Population */}
        <div className="bg-gradient-to-br from-card to-muted/30 border border-primary/20 rounded-2xl p-4 shadow-sm relative mb-2">
          <div className="absolute -top-3 -right-3 w-10 h-10 bg-primary/20 rounded-full blur-xl" />
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
            {isPopulation ? '人群覆盖占比' : '全球全网稀缺度'}
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              {rarity.toFixed(1)}%
            </span>
            <span className={`px-2 py-0.5 text-[9px] font-black rounded-md border ${grade.color}`}>
              {grade.label}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 px-4">
             {quizDef.rarityData?.description || "基于 TESTAR 大数据比对，你的灵魂特质在人群中具有独特的辨识度。"}
          </p>
        </div>
      </div>

      <div className="px-5 pb-24">
        {/* Core Dimensions Plot (Spectrum or Radar) */}
        <div className="mb-8">
          <ResultSummaryCard 
            title={currentResult.title}
            subtitle={currentResult.subtitle || "多维数据透视你的性格底色"}
            chartType={quizDef.visualization === 'radar' ? 'radar' : 'spectrum'}
            dimensionPairs={dimensionPairs}
            dimensions={quizDef.dimensions}
            scores={professionalScores}
            cityBaseline={cityBaseline}
          />
        </div>

        {synergyTags.length > 0 && (
          <ReportBlock title="深度交叉特质识别" icon={Star} delay={0.1}>
            <div className="space-y-4">
              {synergyTags.map((tag, i) => (
                <div key={i} className="bg-primary/5 rounded-xl p-5 border border-primary/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-5">
                    <Star className="w-12 h-12" />
                  </div>
                  <h4 className="font-display font-black text-sm text-primary mb-3">【{tag.title}】</h4>
                  <p className="text-xs leading-relaxed text-foreground/90 mb-6 pb-4 border-b border-primary/10 italic">
                    “{tag.reason}”
                  </p>
                  
                  {tag.q1 && (
                    <div className="space-y-4 relative">
                       <div className="absolute left-2 top-0 bottom-0 w-[1.5px] bg-primary/10" />
                       <div className="pl-6 relative">
                          <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          </div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">关键印证 I</p>
                          <p className="text-[11px] text-foreground/80 mb-2">{tag.q1}</p>
                          <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md italic">
                            选择：{tag.a1}
                          </span>
                       </div>
                       <div className="pl-6 relative">
                          <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          </div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">关键印证 II</p>
                          <p className="text-[11px] text-foreground/80 mb-2">{tag.q2}</p>
                          <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md italic">
                             选择：{tag.a2}
                          </span>
                       </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ReportBlock>
        )}

        {/* 灵魂两极深度剖析 (Fixed) */}
        {dominantTraits.length > 0 && (
          <ReportBlock title="灵魂两极深度剖析" icon={Compass} delay={0.2}>
            <div className="space-y-4">
              {dominantTraits.map((trait, i) => (
                <div key={i} className="flex gap-4 items-start">
                   <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                   <div>
                     <span className="text-xs font-bold text-foreground">{trait.label}</span>
                     <p className="text-[11px] leading-relaxed italic text-muted-foreground mt-1">“{trait.comment}”</p>
                   </div>
                </div>
              ))}
            </div>
          </ReportBlock>
        )}

        {/* 中道平衡感知 (Fixed) */}
        {isBalanced && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-5 rounded-3xl bg-secondary/30 border border-secondary/20 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-secondary rounded-xl text-secondary-foreground">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-display font-black text-sm text-foreground">异常平衡的“中道”之魂</h3>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              检测到你的四个维度偏离程度均低于 10%，这在人群中极罕见。你拥有一种“动态平衡”的能力，在不同的环境下能自如地切换人格侧面。
            </p>
          </motion.div>
        )}

        {currentResult.description && (
          <ReportBlock title={quizDef.id === 'city' ? "主城调性画像" : "灵魂深度画像"} icon={Heart} delay={0.2}>
            <p className="first-letter:text-2xl first-letter:font-bold first-letter:text-primary first-letter:float-left first-letter:mr-2">
              {currentResult.description}
            </p>
          </ReportBlock>
        )}

        {/* New: City Feature Slogans (Select one set from three) */}
        {quizDef.id === 'city' && currentResult.sloganMatrix && (
          <ReportBlock title="城市五维核心特质" icon={Star} delay={0.25}>
             <div className="grid grid-cols-1 gap-3">
                {quizDef.dimensions.map((dim) => {
                   const slogans = currentResult.sloganMatrix?.[dim.key];
                   if (!slogans) return null;
                   // Use score-based modulo to pick 1 of 3 slogans
                   const score = professionalScores[dim.key] || 0;
                   const pickedSlogan = slogans[Math.floor(score * 10) % 3];
                   
                   return (
                     <div key={dim.key} className="flex items-center gap-4 p-3 bg-muted/20 rounded-2xl border border-muted/20">
                        <div className={`w-10 h-10 rounded-xl ${dim.colorClass} flex items-center justify-center text-white font-bold text-[10px] shrink-0`}>
                           {dim.label.slice(0, 2)}
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest leading-none mb-1.5">{dim.label}特色</span>
                           <p className="text-xs font-bold text-foreground/80 italic">“{pickedSlogan}”</p>
                        </div>
                     </div>
                   );
                })}
             </div>
          </ReportBlock>
        )}

        {/* New: City Paid Detailed Analysis */}
        {currentResult.paidAnalysis && (
           <ReportBlock title="深度宜居决策分析" icon={Compass} delay={0.3}>
              <div className="space-y-6">
                 <div>
                    <h4 className="text-[10px] font-black text-emerald-500 uppercase mb-2 tracking-[0.2em]">为什么适合你</h4>
                    <p className="text-xs text-foreground/80 leading-relaxed font-medium bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
                       {currentResult.paidAnalysis.whySuits}
                    </p>
                 </div>
                 
                 <div>
                    <h4 className="text-[10px] font-black text-rose-500 uppercase mb-2 tracking-[0.2em]">可能感到违和的地方</h4>
                    <p className="text-xs text-foreground/80 leading-relaxed font-medium bg-rose-50/50 p-4 rounded-2xl border border-rose-100/50">
                       {currentResult.paidAnalysis.notSuits}
                    </p>
                 </div>

                 <div className="p-5 bg-slate-900 rounded-3xl text-white shadow-xl">
                    <div className="flex items-center gap-2 mb-3">
                       <Zap className="w-4 h-4 text-yellow-400" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">未来路径建议</span>
                    </div>
                    <p className="text-xs leading-relaxed italic opacity-90 mb-4">
                       {currentResult.paidAnalysis.futurePath}
                    </p>
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                       <span className="text-[10px] text-slate-500 font-bold uppercase">同类人群画像</span>
                       <span className="text-[10px] text-yellow-400 font-black">{currentResult.paidAnalysis.peers}</span>
                    </div>
                 </div>
              </div>
           </ReportBlock>
        )}

        {/* New: PRO 会员深度场景分析 */}
        {careerTips && careerTips.length > 0 && (
          <ReportBlock title="职场潜能与避坑指南" icon={Briefcase} delay={0.3}>
            <div className="space-y-4">
               {careerTips.map((tip: string, i: number) => (
                 <div key={i} className="flex gap-3 items-start p-3 bg-red-50/50 rounded-2xl border border-red-100">
                    <div className="p-1.5 bg-red-100/50 rounded-lg text-red-500">
                      <AlertCircle className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-xs text-foreground/80 leading-relaxed font-medium">
                      {tip}
                    </p>
                 </div>
               ))}
               <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 mt-2">
                  <p className="text-[10px] text-primary font-bold uppercase mb-2 tracking-widest">专家优化建议</p>
                  <p className="text-xs text-foreground/70 leading-relaxed italic">
                    “尝试在你的{quizDef.dimensions[0].label}特质与实际业务目标之间建立更直接的量化联系，这能显著提升你的职场溢价。”
                  </p>
               </div>
            </div>
          </ReportBlock>
        )}

        {relationshipAdvice && (
          <ReportBlock title="灵魂交互与人际磁场" icon={Zap} delay={0.3}>
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/40 to-transparent rounded-full" />
              <div className="pl-5">
                <p className="text-xs leading-relaxed text-foreground font-medium mb-4">
                  {relationshipAdvice}
                </p>

              </div>
            </div>
          </ReportBlock>
        )}

        {/* 核心优势库 (Optional Pros & Cons) */}
        <ReportBlock title="核心潜能优势库" icon={Lightbulb} delay={0.2}>
          <div className="grid grid-cols-1 gap-4">
            {coreAdvantages.map((adv, i) => {
              const shortage = quizDef.advantageLib?.[quizDef.dimensions.find(d => d.label.includes(adv.title))?.key || '']?.shortage;
              const showBoth = quizDef.reportConfig?.advantageMode === 'both';
              
              return (
                <div key={i} className="space-y-3">
                  <div className={`p-4 rounded-2xl border ${i === 0 ? 'bg-primary/5 border-primary/10' : 'bg-accent/5 border-accent/10'}`}>
                    <div className="flex items-center gap-2 mb-2">
                       <span className="text-lg">{adv.icon}</span>
                       <strong className="text-sm text-foreground font-black">{adv.title}</strong>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                       {adv.desc}
                    </p>
                  </div>
                  
                  {showBoth && shortage && (
                    <div className="p-4 rounded-2xl border border-dashed border-muted-foreground/20 bg-muted/5">
                      <div className="flex items-center gap-2 mb-2 opacity-70">
                         <AlertCircle className="w-4 h-4 text-muted-foreground" />
                         <strong className="text-xs text-muted-foreground font-black">潜在线性短板</strong>
                      </div>
                      <p className="text-xs text-muted-foreground/80 leading-relaxed italic">
                         {shortage}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ReportBlock>

        {/* 心理足迹回溯 (Dynamic Count) */}
        <ReportBlock title="核心行为足迹回溯" icon={History} delay={0.2}>
          <div className="space-y-6">
            {Object.keys(answers).slice(0, getFootprintCount(quizDef.questionsCount)).map((qId, idx) => {
              const detail = getAnswerDetail(qId);
              if (!detail) return null;
              return (
                <div key={qId} className="border-l-2 border-primary/20 pl-4">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">
                    行为折射点 {idx + 1}
                  </p>
                  <p className="text-[13px] text-foreground font-medium mb-2 leading-relaxed">
                    {detail.question}
                  </p>
                  <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
                    <p className="text-xs leading-relaxed text-foreground/80 italic font-medium">
                      “{detail.option}” — {detail.explanation || "该选择印证了你在这一维度的性格深度。"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ReportBlock>

        {/* Cross-Selling Banner */}
        <div className="mt-4">
          <RelatedTestsBanner />
        </div>

        <div className="mt-12 text-center pb-12 flex flex-col gap-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">— 报告分析结论已闭环 —</p>
          
          <button 
            onClick={() => setIsShareOpen(true)}
            className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-sm btn-press flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            <Share2 className="w-4 h-4" /> 分享生成我的灵魂海报
          </button>

          <button 
            onClick={() => setShowRetestConfirm(true)}
            className="w-full py-4 rounded-2xl bg-white border border-border shadow-sm text-foreground font-bold text-sm btn-press flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-muted-foreground" /> 再测一次
          </button>

          <button 
            onClick={() => navigate('/history')}
            className="w-full py-4 rounded-2xl bg-muted text-muted-foreground font-bold text-sm btn-press flex items-center justify-center gap-2"
          >
            返回探测记录 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <ShareModal 
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        quizTitle={quizDef.title}
        resultTitle={currentResult.title}
        gradeLabel={grade.label}
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
                <p className="text-xs text-muted-foreground leading-relaxed mb-8 text-center">
                   报告仅支持<span className="text-foreground font-bold">单次有效生成</span>。由于报告是唯一的深度解析，重新测试将覆盖当前结果且需使用新的激活码。
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
                    取消，保留报告
                  </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MobileLayout>
  );
};

export default QuizReportPage;

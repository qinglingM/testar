import { motion } from "framer-motion";
import { 
  ArrowLeft, Share2, Sparkles, Zap, Shield, Target, 
  Compass, Lightbulb, History, Filter, AlertCircle 
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuizStore } from "@/store/useQuizStore";
import { getQuizDef } from "@/data/registry";
import MobileLayout from "@/components/layout/MobileLayout";
import Header from "@/components/layout/Header";
import { useEffect, useState } from "react";
import { track } from "@/utils/analytics";
import { ShareModal } from "@/components/quiz/ShareModal";
import ResultSummaryCard from "@/components/quiz/ResultSummaryCard";

interface ReportBlockProps {
  title: string;
  icon: any;
  children: React.ReactNode;
  delay?: number;
}

const ReportBlock = ({ title, icon: Icon, children, delay = 0 }: ReportBlockProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="mb-10 relative"
  >
    <div className="flex items-center gap-3 mb-6 relative">
      {/* Decorative vertical bar to anchor the section */}
      <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary rounded-r-lg shadow-sm" />
      <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h2 className="font-display font-black text-[1.1rem] tracking-tight text-foreground leading-none">
          {title}
        </h2>
        <div className="h-1 w-8 bg-primary/20 rounded-full mt-2" />
      </div>
    </div>
    <div className="relative z-10 px-1">
      {children}
    </div>
  </motion.div>
);

interface CollapsibleAnalysisCardProps {
  content: string;
  accent: string;
  bgClass: string;
  borderClass: string;
  iconElement: React.ReactNode;
  isItalic?: boolean;
}

const CollapsibleAnalysisCard = ({ content, accent, bgClass, borderClass, iconElement, isItalic }: CollapsibleAnalysisCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = content.length > 200;

  return (
    <div className={`relative rounded-3xl border overflow-hidden group ${bgClass} ${borderClass}`}>
      {/* Decorative background icon */}
      <div className="absolute -top-2 -right-2 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
        {iconElement}
      </div>
      
      {/* Accent left bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${accent === 'primary' ? 'bg-primary/40' : 'bg-amber-400/40'} rounded-full`} />
      
      <div className="p-6 pl-7">
        {/* First paragraph highlight */}
        <div className={`text-sm leading-[1.9] text-foreground/85 font-medium whitespace-pre-wrap ${isItalic ? 'italic' : ''} ${!expanded && isLong ? 'line-clamp-5' : ''}`}>
          {content}
        </div>

        {/* Gradient fade overlay when collapsed */}
        {!expanded && isLong && (
          <div className={`absolute bottom-0 left-0 right-0 h-24 ${accent === 'primary' ? 'bg-gradient-to-t from-white via-white/80 to-transparent' : 'bg-gradient-to-t from-amber-50 via-amber-50/80 to-transparent'} pointer-events-none`} />
        )}
      </div>

      {/* Expand/Collapse toggle */}
      {isLong && (
        <button 
          onClick={() => setExpanded(!expanded)}
          className={`relative z-10 w-full py-3 text-center text-xs font-black uppercase tracking-widest transition-colors ${
            accent === 'primary' 
              ? 'text-primary hover:bg-primary/10' 
              : 'text-amber-600 hover:bg-amber-100/50'
          } ${!expanded ? '-mt-4' : 'border-t border-border/20'}`}
        >
          {expanded ? '收起内容 ↑' : '展开全部 ↓'}
        </button>
      )}
    </div>
  );
};

const QuizReportPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isShareOpen, setIsShareOpen] = useState(false);
  
  const finalResult = useQuizStore(state => state.finalResult);
  const dimensionPairs = useQuizStore(state => state.dimensionPairs);
  const answers = useQuizStore(state => state.answers);
  const rarity = useQuizStore(state => state.rarity);
  const professionalScores = useQuizStore(state => state.professionalScores);
  
  const quizDef = slug ? getQuizDef(slug) : null;

  useEffect(() => {
    if (quizDef && finalResult) {
      track('result_pro_view', {
        quiz_id: quizDef.id,
        result_key: finalResult.id || 'default'
      });
    }
  }, [quizDef, finalResult]);

  if (!quizDef || !finalResult) {
    return <MobileLayout><div className="p-6">Loading...</div></MobileLayout>;
  }

  const currentResult = quizDef.results.find(r => r.id === finalResult.id) || finalResult;

  // Sort dimensions to find actual strengths
  const topDimensions = [...(quizDef.dimensions || [])]
    .sort((a, b) => (professionalScores[b.key] || 0) - (professionalScores[a.key] || 0))
    .slice(0, 3);

  // Custom analysis logic based on actual top dimensions
  const coreAdvantages = topDimensions.map((d, index) => {
    let specificDesc = quizDef.advantageLib?.[d.key]?.desc;
    if (!specificDesc) {
      if (index === 0) specificDesc = `在【${d.label}】维度上的显著极值，表明这已成为你的核心壁垒。这不仅意味着你在相关场景中具备绝对的肌肉记忆，更是你在竞争中能够形成错位优势的王牌。不要去补短板，将它发挥到极致即可。`;
      else if (index === 1) specificDesc = `【${d.label}】构成了你重要的副武器。在处理复杂局面时，它常常能作为你第一天赋的缓冲垫，帮助你从另一种视角切入问题，这使得你的行事风格更具层次。`;
      else specificDesc = `【${d.label}】特质的存在，保障了你的底层稳定性。这股潜能虽然不总是显性爆发，但它赋能了你的持久力，让你在顺境和逆境中都能保持一定的自我校验能力。`;
    }
    return {
      title: `${d.label}天赋极高`,
      desc: specificDesc,
      icon: quizDef.advantageLib?.[d.key]?.icon || "✦"
    };
  });

  const keyTips = (quizDef.reportTips || [
    "在关键决策点保持绝对理性的觉察，避免情绪自动化反应主导行为。",
    "将你的核心优势与具体的商业或变现场景结合，才能产生实质的超额溢价。",
    "保持认知框架的开放性，定期反向更新你的固有行为操作系统。"
  ]);

  const relationshipAdvice = quizDef.relationshipAdvice || `你在深度链接中极度渴求真正的灵魂共振。由于你的核心高分特质集中在【${topDimensions[0]?.label || '个体化'}】领域，这使得你在人际交往初期可能会散发出一种难以接近的边界感。极强的边界感能帮你有效过滤低效社交，屏蔽消耗你能量的人；但这也意味着，当你识别出高密度价值对象时，需要有意识地主动展现更多开放性，这能极大加速高质量人脉阵列的建立。`;

  // Footprint count logic
  const getFootprintCount = (total: number) => {
    if (total <= 12) return total;
    return Math.floor(total * 0.6);
  };

  const getAnswerDetail = (qId: string | number) => {
    const q = quizDef.questions.find(q => String(q.id) === String(qId));
    if (!q) return null;
    const ansIdx = answers[String(qId)];
    const opt = q.options[ansIdx as number];
    return { question: q.text, option: opt?.label, explanation: opt?.explanation };
  };

  const getRarityGrade = (r: number = 5) => {
    if (r <= 10) return { label: 'S级 独立波段', color: 'bg-red-400/20 text-red-400 border-red-400/30' };
    if (r <= 18) return { label: 'A级 能量锚点', color: 'bg-red-300/20 text-red-300 border-red-300/30' };
    return { label: 'B级 核心原形', color: 'bg-red-200/20 text-red-300 border-red-200/30' };
  };

  const grade = getRarityGrade(rarity);
  const [isFootprintExpanded, setIsFootprintExpanded] = useState(false);

  return (
    <MobileLayout>
      <Header 
        title={quizDef?.title || '深度探测报告'} 
        onBack={() => navigate('/history')}
        rightElement={
          <button className="p-2 btn-press" onClick={() => setIsShareOpen(true)}>
            <Share2 className="w-5 h-5 text-foreground" />
          </button>
        }
      />
      
      <div className="px-6 pt-8 pb-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
        
        <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary mb-5 border border-primary/20">
          ✓ PRO 版深度定制服务已生效
        </div>
        
        <h1 className="font-display font-extrabold text-[1.8rem] leading-tight text-foreground mb-2 whitespace-pre-wrap">
          {currentResult.title}
        </h1>
        
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${grade.color}`}>
            {grade.label}
          </span>
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
            样本稀缺度 {rarity?.toFixed(1) || '5'}%
          </span>
        </div>
      </div>

      <div className="px-6 pb-24 space-y-4">
        {/* Core Visualization Graph */}
        <div className="mb-6 -mx-1">
          <ResultSummaryCard 
            title={currentResult.title}
            subtitle={currentResult.subtitle}
            dimensionPairs={dimensionPairs}
            chartType={quizDef.visualization === 'radar' ? 'radar' : 'spectrum'}
            dimensions={quizDef.dimensions.map(d => ({ ...d, colorClass: d.colorClass || 'bg-primary' }))}
            scores={professionalScores}
            cityBaseline={typeof currentResult.cityBaseline === 'object' ? currentResult.cityBaseline : undefined}
          />
        </div>

        {/* Pro Analysis Content */}
        {currentResult.paidAnalysis && (
          <ReportBlock title="深度画像解析" icon={Sparkles} delay={0.1}>
             <div className="space-y-4">
                 <div className="p-5 bg-card border border-border rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5"><Shield className="w-12 h-12" /></div>
                    <p className="text-sm leading-relaxed text-foreground/80 font-medium">
                       {currentResult.paidAnalysis.coreDescription}
                    </p>
                 </div>

                 <div className="p-5 bg-slate-900 rounded-3xl text-white shadow-xl">
                    <div className="flex items-center gap-2 mb-3">
                       <Zap className="w-4 h-4 text-yellow-400" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">未来路径建议</span>
                    </div>
                    <p className="text-xs leading-relaxed opacity-90 mb-4">
                       {currentResult.paidAnalysis.futurePath}
                    </p>
                    <div className="h-px bg-white/10 w-full mb-4" />
                    <p className="text-[10px] leading-relaxed text-slate-400">
                       基于当前精准探测位点，建议在未来三个月内有意识地强化对【{topDimensions[0]?.label || quizDef.dimensions[0].label}】维度的刻意练习，这将带来显著的势能突破。
                    </p>
                 </div>
             </div>
          </ReportBlock>
        )}

        {/* Behavioral Analysis - Collapsible & Beautiful */}
        {currentResult.behavioralAnalysis && (
          <ReportBlock title="核心行为模式深度解构" icon={Compass} delay={0.2}>
             <CollapsibleAnalysisCard
               content={currentResult.behavioralAnalysis}
               accent="primary"
               bgClass="bg-gradient-to-br from-primary/5 via-background to-primary/10"
               borderClass="border-primary/15"
               iconElement={<Filter className="w-20 h-20" />}
             />
          </ReportBlock>
        )}

        <div className="h-2" />

        {currentResult.potentialAnalysis && (
          <ReportBlock title="未来 5-10 年潜能演变路径" icon={Target} delay={0.3}>
             <CollapsibleAnalysisCard
               content={currentResult.potentialAnalysis}
               accent="amber"
               bgClass="bg-gradient-to-br from-amber-50/60 via-background to-orange-50/40"
               borderClass="border-amber-200/50"
               iconElement={<Zap className="w-20 h-20" />}
             />
          </ReportBlock>
        )}

        {/* Existing Blocks ... */}
        {keyTips.length > 0 && (
          <ReportBlock title="个人效能进化指南" icon={Lightbulb} delay={0.25}>
             <div className="space-y-3">
                {keyTips.map((tip, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50">
                    <span className="font-display font-black text-primary/40 text-lg">0{i+1}</span>
                    <p className="text-xs text-foreground/80 leading-relaxed font-bold">
                      {tip}
                    </p>
                  </div>
                ))}
                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 mt-2">
                   <p className="text-[10px] text-primary font-bold uppercase mb-2 tracking-widest">专家优化建议</p>
                   <p className="text-xs text-foreground/70 leading-relaxed font-bold">
                     “尝试在你的【{topDimensions[0]?.label || quizDef.dimensions[0].label}】特质与实际变现业务层之间建立更直接的量化联系，这是普通人与顶尖高手的绝对分水岭。”
                   </p>
                </div>
             </div>
          </ReportBlock>
        )}

        {relationshipAdvice && (
          <ReportBlock title="灵魂交互与人际磁场" icon={Zap} delay={0.3}>
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/40 to-transparent rounded-full" />
              <div className="pl-5 cursor-default">
                <p className="text-[13px] leading-relaxed text-foreground font-medium mb-4">
                  {relationshipAdvice}
                </p>
              </div>
            </div>
          </ReportBlock>
        )}

        <ReportBlock title="核心潜能优势库" icon={Lightbulb} delay={0.35}>
          <div className="grid grid-cols-1 gap-4">
            {coreAdvantages.map((adv, i) => (
              <div key={i} className={`p-5 rounded-3xl border ${i === 0 ? 'bg-primary/5 border-primary/10 shadow-sm' : 'bg-accent/5 border-accent/10'}`}>
                <div className="flex items-center gap-3 mb-3">
                   <span className="text-xl shadow-sm">{adv.icon}</span>
                   <strong className="text-[14px] text-foreground font-black tracking-tight">{adv.title}</strong>
                </div>
                <p className="text-[13px] text-muted-foreground leading-relaxed font-bold">
                   {adv.desc}
                </p>
              </div>
            ))}
          </div>
        </ReportBlock>

        <ReportBlock title="核心行为足迹回溯" icon={History} delay={0.4}>
          <div className="space-y-6 relative">
            <div className="flex justify-between items-center mb-4 cursor-pointer btn-press border bg-card p-3 rounded-2xl" onClick={() => setIsFootprintExpanded(!isFootprintExpanded)}>
              <span className="text-xs font-bold text-foreground">作答轨迹追踪 ({getFootprintCount(quizDef.questionsCount)}条)</span>
              <span className="text-xs font-bold text-primary">{isFootprintExpanded ? '收起 ↑' : '展开查看详单 ↓'}</span>
            </div>
            
            {isFootprintExpanded && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6">
                {Object.keys(answers).slice(0, getFootprintCount(quizDef.questionsCount)).map((qId, idx) => {
                  const detail = getAnswerDetail(qId);
                  if (!detail) return null;
                  return (
                    <div key={qId} className="border-l-2 border-primary/20 pl-4 ml-2">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">
                        行为折射点 {idx + 1}
                      </p>
                      <p className="text-[13px] text-foreground font-bold mb-2 leading-relaxed">
                        {detail.question}
                      </p>
                      <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
                        <p className="text-xs leading-relaxed text-foreground/80 font-medium">
                          探测结果：<span className="text-primary font-bold">{detail.option}</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </ReportBlock>
      </div>
      
      <ShareModal 
        isOpen={isShareOpen} 
        onClose={() => setIsShareOpen(false)}
        quizTitle={quizDef.title}
        resultTitle={currentResult.title}
        gradeLabel={grade.label}
      />
    </MobileLayout>
  );
};

export default QuizReportPage;

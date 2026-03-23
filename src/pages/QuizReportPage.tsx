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
    className="mb-8"
  >
    <div className="flex items-center gap-3 mb-4 px-1">
      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
        <Icon className="w-4 h-4" />
      </div>
      <h2 className="font-display font-black text-sm uppercase tracking-widest text-foreground">
        {title}
      </h2>
    </div>
    {children}
  </motion.div>
);

const QuizReportPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isShareOpen, setIsShareOpen] = useState(false);
  
  const finalResult = useQuizStore(state => state.finalResult);
  const dimensionPairs = useQuizStore(state => state.dimensionPairs);
  const answers = useQuizStore(state => state.answers);
  const rarity = useQuizStore(state => state.rarity);
  
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

  // Custom analysis logic based on dimensions
  const coreAdvantages = (quizDef.dimensions || []).map(d => ({
    title: d.label,
    desc: quizDef.advantageLib?.[d.key]?.desc || "该特质展现出高度的独特性与增长潜力。",
    icon: quizDef.advantageLib?.[d.key]?.icon || "✧"
  })).slice(0, 3);

  const keyTips = (quizDef.reportTips || [
    "在关键决策点保持觉察，避免自动化反应。",
    "将你的核心优势与具体场景结合，产生超额溢价。",
    "保持认知的开放性，定期更新你的行为操作系统。"
  ]);

  const relationshipAdvice = quizDef.relationshipAdvice || "你倾向于在深度链接中寻找安全感。建议在交往初期展示更多的边界感，这有助于建立更稳固的长久关系。";

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
                    <p className="text-xs leading-relaxed italic opacity-90 mb-4">
                       {currentResult.paidAnalysis.futurePath}
                    </p>
                    <div className="h-px bg-white/10 w-full mb-4" />
                    <p className="text-[10px] leading-relaxed text-slate-400">
                       基于当前探测位点，建议在未来三个月内有意识地强化{quizDef.dimensions[0].label}维度的冗余度。
                    </p>
                 </div>
             </div>
          </ReportBlock>
        )}

        {/* Behavioral Analysis Styling Update */}
        {currentResult.behavioralAnalysis && (
          <ReportBlock title="核心行为模式深度解构" icon={Compass} delay={0.2}>
             <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Filter className="w-16 h-16" /></div>
                <p className="text-[13px] leading-relaxed text-foreground font-medium whitespace-pre-wrap">
                  {currentResult.behavioralAnalysis}
                </p>
             </div>
          </ReportBlock>
        )}

        <div className="h-2" />

        {currentResult.potentialAnalysis && (
          <ReportBlock title="未来 5-10 年潜能演变路径" icon={Target} delay={0.3}>
             <div className="p-6 rounded-3xl bg-amber-50/50 border border-amber-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Zap className="w-16 h-16" /></div>
                <p className="text-[13px] leading-relaxed text-foreground font-medium whitespace-pre-wrap italic">
                  {currentResult.potentialAnalysis}
                </p>
             </div>
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
                   <p className="text-xs text-foreground/70 leading-relaxed italic font-bold">
                     “尝试在你的{quizDef.dimensions[0].label}特质与实际业务目标之间建立更直接的量化联系，这能显著提升你的溢价。”
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
              <div key={i} className={`p-5 rounded-3xl border ${i === 0 ? 'bg-primary/5 border-primary/10' : 'bg-accent/5 border-accent/10'}`}>
                <div className="flex items-center gap-3 mb-2">
                   <span className="text-xl">{adv.icon}</span>
                   <strong className="text-[13px] text-foreground font-black">{adv.title}</strong>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-bold">
                   {adv.desc}
                </p>
              </div>
            ))}
          </div>
        </ReportBlock>

        <ReportBlock title="核心行为足迹回溯" icon={History} delay={0.4}>
          <div className="space-y-6">
            {Object.keys(answers).slice(0, getFootprintCount(quizDef.questionsCount)).map((qId, idx) => {
              const detail = getAnswerDetail(qId);
              if (!detail) return null;
              return (
                <div key={qId} className="border-l-2 border-primary/20 pl-4">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">
                    行为折射点 {idx + 1}
                  </p>
                  <p className="text-[13px] text-foreground font-bold mb-2 leading-relaxed">
                    {detail.question}
                  </p>
                  <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
                    <p className="text-xs leading-relaxed text-foreground/80 italic font-medium">
                      探测结果：<span className="text-primary font-bold">{detail.option}</span>
                    </p>
                  </div>
                </div>
              );
            })}
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

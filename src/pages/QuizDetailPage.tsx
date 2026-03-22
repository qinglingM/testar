import { useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Users, Clock, Target, Play } from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import Header from "@/components/layout/Header";
import { getQuizDef } from "@/data/registry";
import { track } from "@/utils/analytics";

const QuizDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const quizDef = slug ? getQuizDef(slug) : null;

  useEffect(() => {
    if (quizDef) {
       track('quiz_detail_view', {
         quiz_id: quizDef.id,
         quiz_slug: slug || ''
       });
    }
  }, [quizDef, slug]);

  if (!quizDef) {
    return (
      <MobileLayout>
        <Header title="找不到测试" />
        <div className="flex-1 flex items-center justify-center p-6 text-muted-foreground">该测试不存在或已下线</div>
      </MobileLayout>
    );
  }

  const { title: quizTitle, subtitle: quizSubtitle, questionsCount, participantsCount } = quizDef;

  return (
    <MobileLayout>
      <Header transparent />
      
      {/* Cover Image Area */}
      <div className="px-6 mt-2 mb-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full aspect-square max-h-[300px] rounded-[2rem] gradient-primary shadow-sm flex items-center justify-center relative overflow-hidden"
        >
          {quizDef.coverImage ? (
            <img 
              src={quizDef.coverImage} 
              alt={quizTitle} 
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <>
              {/* Decorative blur elements inside cover fallback */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-2xl rounded-full" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 blur-2xl rounded-full" />
              <span className="text-6xl text-white drop-shadow-md">✧</span>
            </>
          )}
        </motion.div>
      </div>

      {/* Info Section */}
      <div className="px-6 pb-32">
        <motion.div
           initial={{ opacity: 0, y: 15 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
        >
          <div className="flex gap-2 mb-3">
            <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-semibold text-red-500 uppercase tracking-wider border border-red-100">
              [假] 心理学专业
            </span>
          </div>
          <h1 className="font-display font-extrabold text-[1.75rem] leading-tight mb-2 text-foreground">
            {quizTitle}
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6 italic">
            {quizSubtitle}
          </p>

          {/* Stats Row */}
          <div className="flex items-center gap-6 py-4 border-y border-border/50 mb-8">
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><Target className="w-3.5 h-3.5" /> 题目数量</span>
              <span className="font-display font-bold text-foreground">{questionsCount} 题</span>
            </div>
            <div className="w-px h-8 bg-border/50" />
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><Clock className="w-3.5 h-3.5" /> 预计耗时</span>
              <span className="font-display font-bold text-foreground">
                {quizDef.estimatedMinutes || Math.ceil(questionsCount / 10)} 分钟
              </span>
            </div>
            <div className="w-px h-8 bg-border/50" />
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><Users className="w-3.5 h-3.5" /> 已测人数</span>
              <span className="font-display font-bold text-red-500">[假] {participantsCount}</span>
            </div>
          </div>

          {/* Value Prop */}
          <h3 className="font-display font-bold text-sm mb-3 text-foreground">你将获得什么</h3>
          <ul className="space-y-3">
            {(quizDef.valueProps || [
              "深度的核心性格维度剖析",
              "你的社交行为模式与雷达图",
              "专属的潜在优势与发展卡点建议"
            ]).map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs mt-0.5">✓</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Bottom Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent z-40 max-w-md mx-auto">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-[1.25rem] bg-foreground text-background font-display font-bold text-[1rem] btn-press flex items-center justify-center gap-2 shadow-lg hover:bg-foreground/90 transition-colors"
          onClick={() => {
            if (quizDef) {
              track('quiz_start', { quiz_id: quizDef.id });
            }
            navigate(`/quiz/${slug}/play`);
          }}
        >
          <Play className="w-5 h-5 fill-background" />
          开始测试
        </motion.button>
      </div>
    </MobileLayout>
  );
};

export default QuizDetailPage;

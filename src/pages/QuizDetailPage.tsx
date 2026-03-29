import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Clock, Target, Play, Key, X, Sparkles, ClipboardPaste, Flame,
  ArrowLeft, Share2, Zap, Shield, Compass, Lightbulb, History, Filter, AlertCircle 
} from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import Header from "@/components/layout/Header";
import { getQuizDef } from "@/data/registry";
import { track } from "@/utils/analytics";
import { useQuizStore } from "@/store/useQuizStore";
import { toast } from "sonner";
import { CenteredErrorModal } from "@/components/ui/CenteredErrorModal";
import AuthModal from "@/components/home/AuthModal";

const QuizDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [showStartModal, setShowStartModal] = useState(false);
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const verifyActivationCode = useQuizStore(state => state.verifyActivationCode);
  const isVip = useQuizStore(state => state.isVip);
  const isBaseVip = useQuizStore(state => state.isBaseVip);
  const isTmax = useQuizStore(state => state.isTmax);
  const startQuiz = useQuizStore(state => state.startQuiz);
  const incrementTestUsage = useQuizStore(state => state.incrementTestUsage);
  const user = useQuizStore(state => state.user);
  
  // Mirror user ID to localStorage for analytics to avoid circular dependency
  useEffect(() => {
    if (user?.id) {
       localStorage.setItem('testar_user_id', user.id);
       (window as any).__USER_ID__ = user.id;
    } else {
       localStorage.removeItem('testar_user_id');
       (window as any).__USER_ID__ = undefined;
    }
  }, [user?.id]);

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

  const handleStartFinal = async () => {
    if (quizDef) {
      if (isTmax) {
        const usageResult = await incrementTestUsage();
        if (!usageResult.ok) {
          toast.error(usageResult.message || "今日测试额度已用完");
          return;
        }
      }
      track('quiz_start', { quiz_id: quizDef.id });
      startQuiz(quizDef.id);
      navigate(`/quiz/${slug}/play`);
    }
  };

  const handleActivation = async () => {
    if (!code.trim()) {
      toast.error("请输入激活码以开启测试");
      return;
    }

    setIsVerifying(true);
    // Explicitly pass quizDef.id as the test hasn't officially started (so currentQuizId is null)
    const result = await verifyActivationCode(code, 'start', quizDef?.id);
    setIsVerifying(false);

    if (result.ok) {
      toast.success(result.message || "验证成功！探测引擎已就绪");
      handleStartFinal();
    } else {
      setErrorMessage(result.message || "激活码无效，请检查后再试");
      setShowErrorModal(true);
    }
  };

  // Removed handlePaste and associated logic per user request

  return (
    <MobileLayout>
      <Header transparent />
      
      {/* Cover Image Area */}
      <div className="px-6 mt-2 mb-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full aspect-square max-h-[300px] rounded-[3rem] gradient-primary shadow-2xl flex items-center justify-center relative overflow-hidden mx-auto"
        >
          {quizDef.coverImage ? (
            <img 
              src={quizDef.coverImage} 
              alt={quizTitle} 
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <>
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
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-black text-primary uppercase tracking-widest border border-primary/20">
              顶级心理学架构
            </span>
          </div>
          <h1 className="font-display font-extrabold text-[1.75rem] leading-tight mb-2 text-foreground">
            {quizTitle}
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6 italic font-medium">
            {quizSubtitle}
          </p>

          <div className="flex items-center gap-6 py-4 border-y border-border/50 mb-8">
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1 font-bold"><Target className="w-3.5 h-3.5" /> 题目数量</span>
              <span className="font-display font-black text-foreground">{questionsCount} 题</span>
            </div>
            <div className="w-px h-8 bg-border/50" />
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1 font-bold"><Clock className="w-3.5 h-3.5" /> 预计耗时</span>
              <span className="font-display font-black text-foreground">
                {quizDef.estimatedMinutes || Math.ceil(questionsCount / 10)} 分钟
              </span>
            </div>
            <div className="w-px h-8 bg-border/50" />
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1 font-bold"><Flame className="w-3.5 h-3.5 text-orange-500" /> 当前热度</span>
              <span className="font-display font-black text-foreground">
                {(isNaN(Number(participantsCount)) ? 0 : Number(participantsCount)).toLocaleString()}
              </span>
            </div>
          </div>

          <h3 className="font-display font-black text-xs mb-3 text-muted-foreground uppercase tracking-widest">探测收益详情</h3>
          <ul className="space-y-3">
            {(quizDef.valueProps || [
              "深度的核心性格维度剖析",
              "你的社交行为模式与雷达图",
              "专属的潜在优势与发展卡点建议"
            ]).map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-foreground/80 font-bold">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs mt-0.5 font-black">✓</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-background via-background to-transparent z-40 max-w-md mx-auto flex justify-center">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-2/3 mx-auto h-16 rounded-[2rem] btn-premium shadow-2xl flex items-center justify-center gap-3 transition-all"
          onClick={() => {
            if (isTmax) {
              handleStartFinal();
            } else if (!user) {
              setShowAuthModal(true);
            } else {
              setShowStartModal(true);
            }
          }}
        >
          <Play className="w-5 h-5 fill-white" />
          <span className="text-lg font-black uppercase tracking-widest text-white">开 始 探 测</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {showStartModal && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4 sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowStartModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-background rounded-[3rem] p-8 pt-6 pb-12 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Key className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-black">激活探测权限</h2>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Authentication Required</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowStartModal(false)}
                  className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center btn-press"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-8">
                <p className="text-xs text-muted-foreground leading-relaxed px-1 font-medium italic">
                  为了保证分析报告的客观性与深度，本测试采取激活制。请输入您获取的激活码开启探测。
                </p>

                <div className="space-y-6">
                    <div className="flex flex-col gap-4">
                       <div className="relative group">
                         <input 
                           type="text"
                           placeholder="XXXX-XXXX-XXXX-XXXX"
                           value={code}
                           onChange={(e) => setCode(e.target.value.toUpperCase())}
                           className="w-full h-24 bg-muted/40 border-2 border-border/50 rounded-3xl px-6 text-center font-display font-black tracking-[0.2em] text-xl focus:border-primary focus:bg-background focus:ring-8 focus:ring-primary/5 outline-none transition-all placeholder:text-muted-foreground/30 placeholder:tracking-normal placeholder:font-medium uppercase shadow-inner"
                           onKeyDown={(e) => e.key === 'Enter' && handleActivation()}
                         />
                         <Key className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground/20 group-focus-within:text-primary transition-colors pointer-events-none" />
                       </div>
                    </div>
                   
                    <button 
                      onClick={handleActivation}
                      disabled={!code.trim() || isVerifying}
                      className="w-2/3 mx-auto h-16 rounded-[2rem] btn-premium shadow-xl animate-gradient-x disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      {isVerifying ? (
                         <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                       ) : (
                         <>
                           <Zap className="w-6 h-6 fill-white text-white" />
                           <span className="text-xl font-black uppercase tracking-widest text-white">立即激活</span>
                         </>
                       )}
                    </button>
                </div>

                <div className="p-5 bg-muted/30 rounded-3xl border border-border/50 text-center">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">如何获取激活码？</h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed font-bold">
                      关注微信公众号“<span className="text-primary">TESTSAR 探测星</span>”<br/>点击“获取权限”菜单即可领取激活补给。
                    </p>
                </div>

                {!user && (
                  <button 
                    onClick={() => { setShowStartModal(false); setShowAuthModal(true); }}
                    className="w-full py-4 rounded-2xl bg-primary/10 text-primary font-black text-sm btn-press border border-primary/20"
                  >
                    还没登录？点此快速登录
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <CenteredErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        message={errorMessage}
      />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </MobileLayout>
  );
};

export default QuizDetailPage;

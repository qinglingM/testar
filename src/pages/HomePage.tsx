import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { UserCircle } from "lucide-react";
import logoIcon from "@/assets/logo-icon.png";
import MobileLayout from "@/components/layout/MobileLayout";
import QuizCard from "@/components/quiz/QuizCard";
import { HotTestsCarousel } from "@/components/home/HotTestsCarousel";
import { ALL_TESTS } from "@/data/test-metadata";

import { useQuizStore } from "@/store/useQuizStore";
import { ReportHistoryCard } from "@/components/home/ReportHistoryCard";
import UserDrawer from "@/components/home/UserDrawer";
import { getQuizDef } from "@/data/registry";
import { useState, useEffect } from "react";

const HomePage = () => {
  const navigate = useNavigate();
  const [isUserOpen, setIsUserOpen] = useState(false);
  const completedReports = useQuizStore(state => state.completedReports);
  const loadReportFromHistory = useQuizStore(state => state.loadReportFromHistory);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  
  const hotTests = [...ALL_TESTS].sort((a, b) => b.intensity - a.intensity).slice(0, 3);

  return (
    <MobileLayout>
      <UserDrawer isOpen={isUserOpen} onClose={() => setIsUserOpen(false)} />
      
      <section className="relative px-6 pt-14 pb-10 overflow-hidden">
        <div className="absolute top-10 -right-10 w-40 h-40 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-32 -left-10 w-32 h-32 rounded-full bg-accent/20 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-border/10 flex items-center justify-center p-1.5 overflow-hidden">
                <img src={logoIcon} alt="探测星" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg tracking-tight text-foreground leading-none">探测星</span>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-1">TESTAR</span>
              </div>
            </div>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsUserOpen(true)}
              className="w-10 h-10 rounded-full bg-muted/40 border border-border/50 flex items-center justify-center text-muted-foreground btn-press"
            >
              <UserCircle className="w-6 h-6" />
            </motion.button>
          </div>

          <h1 className="font-display font-extrabold text-[2.2rem] leading-tight mb-4 text-foreground">
            探索真实的
            <br />
            <span className="text-primary italic">你自己 ✦</span>
          </h1>

          <p className="text-muted-foreground/90 text-sm leading-relaxed max-w-[280px]">
            AI 驱动的专业且有趣的测评，用科学探索你的内在宇宙。
          </p>
        </motion.div>
      </section>

      <HotTestsCarousel tests={hotTests} />

      {completedReports.length > 0 && (
        <section className="mt-8 mb-10 overflow-hidden">
          <div className="px-6 flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
              最近测过 <span className="text-[10px] font-normal text-muted-foreground uppercase tracking-wider">Recently</span>
            </h2>
          </div>
          <div className="flex gap-4 overflow-x-auto px-6 pb-4 no-scrollbar scroll-smooth">
            {[...completedReports]
              .filter(r => !!getQuizDef(r.quizId))
              .sort((a,b) => b.timestamp - a.timestamp)
              .map((report) => (
                <div key={`${report.quizId}-${report.timestamp}`} className="shrink-0 w-[240px]">
                  <ReportHistoryCard 
                    report={report} 
                    onClick={() => {
                      loadReportFromHistory(report);
                      const isVipUser = useQuizStore.getState().user?.isVip;
                      navigate(`/quiz/${report.quizId}/${isVipUser ? 'report' : 'result'}`);
                    }}
                  />
                </div>
              ))}
          </div>
        </section>
      )}

      <section className="px-6 pb-20">
        <h2 className="font-display font-bold text-lg mb-4 text-foreground flex items-center gap-2">
          全部测试 <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{ALL_TESTS.length}</span>
        </h2>
        <div className="space-y-4">
          {ALL_TESTS.map((test, i) => (
            <QuizCard 
              key={test.id}
              id={test.id}
              title={test.title}
              subtitle={test.subtitle}
              coverImage={getQuizDef(test.id)?.coverImage || ""}
              questionsCount={test.questions}
              participantsText={test.participants}
              colorClass={test.color}
              onClick={() => navigate(`/quiz/${test.id}`)}
              index={i}
              sourceModule="all_tests"
            />
          ))}
        </div>
      </section>
    </MobileLayout>
  );
};

export default HomePage;

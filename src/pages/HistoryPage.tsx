import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, History, Filter } from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import Header from "@/components/layout/Header";
import { useQuizStore } from "@/store/useQuizStore";
import { ReportHistoryCard } from "@/components/home/ReportHistoryCard";
import { getQuizDef } from "@/data/registry";

const HistoryPage = () => {
  const navigate = useNavigate();
  const completedReports = useQuizStore(state => state.completedReports);
  const loadReportFromHistory = useQuizStore(state => state.loadReportFromHistory);
  const fetchUserHistory = useQuizStore(state => state.fetchUserHistory);
  const user = useQuizStore(state => state.user);

  useEffect(() => {
    if (user) {
      fetchUserHistory();
    }
  }, [user, fetchUserHistory]);

  const sortedReports = [...completedReports]
    .filter(r => !!getQuizDef(r.quizId))
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <MobileLayout className="bg-muted/30">
      <Header 
        title="我的探测报告" 
        onBack={() => navigate('/')} 
      />

      <div className="px-6 pt-6 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground flex items-center gap-3">
              历史轨迹
              <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {sortedReports.length}
              </span>
            </h2>
            <p className="text-xs text-muted-foreground mt-1">记录你探测内在宇宙的每一步</p>
          </div>
          <button className="w-10 h-10 rounded-full bg-background border border-border/50 flex items-center justify-center text-muted-foreground btn-press">
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {sortedReports.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {sortedReports.map((report, idx) => (
              <motion.div
                key={`${report.quizId}-${report.timestamp}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <ReportHistoryCard 
                  report={report}
                  onClick={() => {
                    loadReportFromHistory(report);
                    navigate(`/quiz/${report.quizId}/report`);
                  }}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 rounded-full bg-muted/40 flex items-center justify-center text-muted-foreground mb-4">
              <History className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-foreground">空空如也</h3>
            <p className="text-sm text-muted-foreground max-w-[200px] mt-2">
              你还没有完成任何探测，快去探索真实的自己吧！
            </p>
            <button 
              onClick={() => navigate('/')}
              className="mt-8 px-8 py-3 bg-primary text-white rounded-2xl font-bold text-sm btn-press shadow-lg shadow-primary/20"
            >
              立即去测试
            </button>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default HistoryPage;

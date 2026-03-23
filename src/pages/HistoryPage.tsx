import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, History, Filter, Check, X } from "lucide-react";
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
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'vip' | 'free'>('all');

  useEffect(() => {
    if (user) {
      fetchUserHistory();
    }
  }, [user, fetchUserHistory]);

  const sortedReports = [...completedReports]
    .filter(r => !!getQuizDef(r.quizId))
    .filter(r => {
      if (filter === 'all') return true;
      if (filter === 'vip') return (r.metadata as any)?.isVip;
      if (filter === 'free') return !(r.metadata as any)?.isVip;
      return true;
    })
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
          <button 
            onClick={() => setIsFilterOpen(true)}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all btn-press ${isFilterOpen ? 'bg-primary border-primary text-white' : 'bg-background border-border/50 text-muted-foreground'}`}
          >
            <Filter className={`w-4 h-4 ${filter !== 'all' ? 'fill-current' : ''}`} />
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
            <h3 className="text-lg font-bold text-foreground">{filter === 'all' ? '空空如也' : '无匹配报告'}</h3>
            <p className="text-sm text-muted-foreground max-w-[200px] mt-2">
              {filter === 'all' ? '你还没有完成任何探测' : '当前筛选条件下没有找到报告'}
            </p>
            {filter !== 'all' && (
              <button 
                onClick={() => setFilter('all')}
                className="mt-4 text-xs font-bold text-primary underline"
              >
                重置筛选条件
              </button>
            )}
          </div>
        )}
      </div>

      {/* Filter Modal */}
      <AnimatePresence>
        {isFilterOpen && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setIsFilterOpen(false)}
               className="absolute inset-0 bg-black/60 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
               className="relative w-full max-w-sm bg-background rounded-t-[2.5rem] rounded-b-[1.5rem] p-8 pb-10 shadow-2xl"
             >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-display font-black">筛选报告</h3>
                  <button onClick={() => setIsFilterOpen(false)} className="p-2"><X className="w-5 h-5" /></button>
                </div>
                
                <div className="space-y-3">
                  <FilterOption 
                    label="所有报告" 
                    isActive={filter === 'all'} 
                    onClick={() => { setFilter('all'); setIsFilterOpen(false); }} 
                  />
                  <FilterOption 
                    label="深度分析 (VIP)" 
                    isActive={filter === 'vip'} 
                    onClick={() => { setFilter('vip'); setIsFilterOpen(false); }} 
                  />
                  <FilterOption 
                    label="初步画像 (免费)" 
                    isActive={filter === 'free'} 
                    onClick={() => { setFilter('free'); setIsFilterOpen(false); }} 
                  />
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MobileLayout>
  );
};

const FilterOption = ({ label, isActive, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${isActive ? 'bg-primary/5 border-primary text-primary shadow-sm' : 'bg-muted/30 border-transparent text-muted-foreground'}`}
  >
    <span className="font-bold text-sm">{label}</span>
    {isActive ? <Check className="w-5 h-5" /> : <div className="w-5 h-5 rounded-full border-2 border-muted" />}
  </button>
);

export default HistoryPage;

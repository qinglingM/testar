import { motion } from "framer-motion";
import { CompletedReport } from "@/store/useQuizStore";
import { getQuizDef } from "@/data/registry";
import { ChevronRight } from "lucide-react";

interface ReportHistoryCardProps {
  report: CompletedReport;
  onClick: () => void;
}

export const ReportHistoryCard = ({ report, onClick }: ReportHistoryCardProps) => {
  const quizDef = getQuizDef(report.quizId);

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-card border border-border/50 rounded-3xl p-3 flex items-center justify-between group btn-press shadow-sm"
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white flex-shrink-0 shadow-sm border border-border/10 flex items-center justify-center p-1">
          {quizDef?.icon || quizDef?.coverImage ? (
            <img 
              src={quizDef.icon || quizDef.coverImage} 
              alt={quizDef.title} 
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
              {quizDef?.title.charAt(0) || '✦'}
            </div>
          )}
        </div>
        <div className="truncate">
          <h4 className="font-display font-bold text-[0.9rem] text-foreground truncate flex items-center gap-1.5">
            {quizDef?.title || '未知测评'}
            {report.metadata?.tag && (
              <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-black">
                {report.metadata.tag}
              </span>
            )}
          </h4>
          <p className="text-[10px] text-muted-foreground mt-0.5 truncate opacity-70">
            {report.metadata?.tag ? `第 ${report.metadata.sequence} 次深度探测数据` : '查看我的深度探测数据'}
          </p>
        </div>
      </div>
      <div className="w-8 h-8 rounded-full bg-muted/40 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors ml-2">
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
    </motion.div>
  );
};

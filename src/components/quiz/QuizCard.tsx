import { ChevronRight, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { track } from "@/utils/analytics";

interface QuizCardProps {
  id: string;
  title: string;
  subtitle: string;
  coverImage: string;
  questionsCount: number;
  participantsText: number;
  colorClass: string;
  onClick: () => void;
  index?: number;
  sourceModule?: string;
}

const QuizCard = ({
  id,
  title,
  subtitle,
  coverImage,
  questionsCount,
  participantsText,
  onClick,
  index = 0,
  sourceModule = "unknown"
}: QuizCardProps) => {
  const handleClick = () => {
    track('quiz_click', {
      quiz_id: id,
      source_module: sourceModule,
      position_index: index
    });
    onClick();
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.4 }}
      className="glass-card p-4 flex items-center gap-4 btn-press cursor-pointer bg-card hover:bg-muted/50 transition-colors"
      onClick={handleClick}
    >
      <div className={`w-14 h-14 rounded-2xl overflow-hidden shrink-0 shadow-sm bg-white border border-border/10 flex items-center justify-center p-1`}>
        <img src={coverImage} alt={title} className="w-full h-full object-contain" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-bold text-[1.05rem] text-foreground">{title}</p>
        <p className="text-muted-foreground text-sm mt-0.5 line-clamp-1">{subtitle}</p>
        <p className="text-muted-foreground/80 text-xs mt-1.5 font-medium flex items-center gap-1.5">
          <span>{questionsCount}题</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          <span className="flex items-center gap-0.5 text-orange-500 font-bold">
            <Flame className="w-3 h-3" />
            热度 {participantsText.toLocaleString()}
          </span>
        </p>
      </div>
      <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center shrink-0">
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>
    </motion.div>
  );
};

export default QuizCard;

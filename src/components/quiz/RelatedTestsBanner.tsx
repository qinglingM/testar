import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { ALL_TESTS } from "@/data/test-metadata";
import { getQuizDef } from "@/data/registry";
import { track } from "@/utils/analytics";

export const RelatedTestsBanner = () => {
  // Recommend top tests that aren't the main ones (or just show a selection)
  const recommendations = ALL_TESTS.filter(t => t.id !== 'mbti').slice(0, 4);
  return (
    <div className="mt-8 mb-12">
      <h3 className="px-1 flex items-center justify-between mb-4">
        <span className="font-display font-black text-xs text-foreground/50 uppercase tracking-widest">
          你可能还想测 (Suggested)
        </span>
      </h3>

      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-5 px-5">
        {recommendations.map((test) => {
          const quizDef = getQuizDef(test.id);
          return (
            <motion.div
              key={test.id}
              whileTap={{ scale: 0.96 }}
              className="flex-shrink-0 w-[240px] p-4 bg-card border rounded-2xl shadow-sm relative overflow-hidden group btn-press"
              onClick={() => {
                track('quiz_click', {
                  quiz_id: test.id,
                  source_module: 'related'
                });
                window.location.href = `/quiz/${test.id}`;
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-white flex-shrink-0 border border-border/10 flex items-center justify-center p-1">
                  <img src={quizDef?.icon || quizDef?.coverImage} alt={test.title} className="w-full h-full object-contain" />
                </div>
                <div>
                   <h4 className="font-display font-bold text-sm text-foreground mb-0.5">{test.title}</h4>
                   <p className="text-[10px] text-muted-foreground line-clamp-1">{test.subtitle}</p>
                </div>
              </div>
              
              <div className="mt-3 flex items-center text-[10px] font-bold text-primary gap-1">
                点击进入 <ChevronRight className="w-3 h-3" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

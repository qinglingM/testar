import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ArrowRight } from "lucide-react";
import { getQuizDef } from "@/data/registry";
import { track } from "@/utils/analytics";

interface HotTest {
  id: string;
  title: string;
  subtitle: string;
  participants: string;
  questions: number;
  intensity: number; // 0-100
  color: string;
}

interface HotTestsCarouselProps {
  tests: HotTest[];
}

export const HotTestsCarousel = ({ tests }: HotTestsCarouselProps) => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  // Auto-cycle every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % tests.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [tests.length]);

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 50;
    if (info.offset.x < -threshold) {
      setIndex((prev) => (prev + 1) % tests.length);
    } else if (info.offset.x > threshold) {
      setIndex((prev) => (prev - 1 + tests.length) % tests.length);
    }
  };

  const current = tests[index];

  return (
    <section className="px-6 mb-8 select-none">
      <div className="relative h-[110px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0 bg-primary/5 border border-primary/20 rounded-3xl p-5 btn-press cursor-grab active:cursor-grabbing overflow-hidden group"
            onClick={() => {
              track('quiz_click', {
                quiz_id: current.id,
                source_module: 'hot_carousel',
                position_index: index
              });
              navigate(`/quiz/${current.id}`);
            }}
          >
            {/* Animated accent blob */}
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0]
              }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" 
            />
            
            <div className="relative z-10 flex items-center justify-between h-full">
              <div className="flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden bg-white/50 p-1 flex items-center justify-center mr-4">
                <img 
                  src={getQuizDef(current.id)?.coverImage} 
                  alt={current.title} 
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="flex-1 pr-2">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[9px] font-semibold text-primary uppercase tracking-widest">
                    🔥 今日热门
                  </span>
                </div>
                <h3 className="font-display font-bold text-base text-foreground truncate">
                  {current.title}
                </h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  <span className="text-red-500 font-bold">{current.participants}</span>人已测 · 推荐度 <span className="text-red-500 font-bold">{current.intensity}%</span>
                </p>
              </div>
              
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-md shadow-primary/30 group-hover:scale-110 transition-transform">
                <ArrowRight className="w-4 h-4 text-primary-foreground" />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Pagination Dots */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {tests.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-300 ${i === index ? 'w-4 bg-primary' : 'w-1.5 bg-primary/20'}`} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

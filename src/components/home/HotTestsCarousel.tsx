import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ArrowRight, Flame } from "lucide-react";
import { getQuizDef } from "@/data/registry";
import { track } from "@/utils/analytics";

interface HotTest {
  id: string;
  title: string;
  subtitle: string;
  participants: number | string;
  questions: number;
  intensity: number; // 0-100
  color: string;
}

interface HotTestsCarouselProps {
  tests: HotTest[];
}

export const HotTestsCarousel = ({ tests }: HotTestsCarouselProps) => {
  const [page, setPage] = useState([0, 0]); // [index, direction]
  const navigate = useNavigate();
  const index = page[0];
  const direction = page[1];

  const paginate = (newDirection: number) => {
    setPage([(index + newDirection + tests.length) % tests.length, newDirection]);
  };

  // Auto-cycle every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 4000);
    return () => clearInterval(timer);
  }, [index, tests.length]);

  const variants: any = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.9
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.9,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    })
  };

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipe = Math.abs(offset.x) * velocity.x;
    if (swipe < -1000) {
      paginate(1);
    } else if (swipe > 1000) {
      paginate(-1);
    }
  };

  const current = tests[index];

  return (
    <section className="px-6 mb-10 select-none">
      <div className="relative h-[110px] overflow-visible">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={current.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 bg-primary/5 border border-primary/20 rounded-3xl p-5 btn-press cursor-grab active:cursor-grabbing overflow-hidden group shadow-sm"
            onClick={(e) => {
              // Only navigate if it wasn't a drag
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
            
            <div className="relative z-10 flex items-center justify-between h-full pointer-events-none">
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
                <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                  <Flame className="w-2.5 h-2.5 text-orange-500 fill-orange-500" />
                  <span className="font-black text-foreground">热度 {Number(current.participants).toLocaleString()}</span>
                  <span className="mx-1 opacity-20">|</span>
                  <span className="font-medium">推荐度 <span className="font-black text-foreground">{current.intensity}%</span></span>
                </p>
              </div>
              
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-md shadow-primary/30 group-hover:scale-110 transition-transform">
                <ArrowRight className="w-4 h-4 text-primary-foreground" />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Pagination Dots with Nodes */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {tests.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setPage([i, i > index ? 1 : -1])}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-5 bg-primary' : 'w-1.5 bg-primary/20 hover:bg-primary/40'}`} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

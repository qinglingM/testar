import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { BrainCircuit, Fingerprint, Database, Sparkle, Shield, Activity, Target, HeartPulse, Lock, UserCircle, Zap, Eye, Ruler, Volume2, Search, Briefcase, MousePointer, Lightbulb } from "lucide-react";
import { getQuizDef } from "@/data/registry";

const iconMap: Record<string, any> = {
  Fingerprint, Database, BrainCircuit, Sparkle, Shield, Activity, Target, HeartPulse, Lock, UserCircle, Zap, Eye, Ruler, Volume2, Search, Briefcase, MousePointer, Lightbulb
};

const QuizAnalyzingPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  
  const quizDef = slug ? getQuizDef(slug) : null;
  const analysisSteps = quizDef?.analysisSteps || [
    { text: "正在收集作答碎片...", icon: "Fingerprint" },
    { text: "比对样本数据库...", icon: "Database" },
    { text: "人格画像生成中...", icon: "BrainCircuit" },
    { text: "揭示最终灵魂底色...", icon: "Sparkle" }
  ];

  useEffect(() => {
    // Reveal a new processing step every 1000ms
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < analysisSteps.length - 1) {
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, 1000);

    // After all steps are done (+ 800ms for final feel), navigate to result
    const totalTime = (analysisSteps.length * 1000) + 800;
    const finalTimer = setTimeout(() => {
      navigate(`/quiz/${slug}/result`);
    }, totalTime);

    return () => {
      clearInterval(timer);
      clearTimeout(finalTimer);
    };
  }, [navigate, slug, analysisSteps.length]);

  const CurrentStepIcon = iconMap[analysisSteps[currentStep].icon] || Sparkle;

  return (
    <MobileLayout className="bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[100px] rounded-full" />
      </div>

      <div className="w-full max-w-sm px-6 flex flex-col items-center z-10">
        {/* Animated Icon Container */}
        <div className="relative mb-12">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center relative z-10"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 1.5, rotate: 20 }}
                transition={{ type: "spring", damping: 12 }}
              >
                <CurrentStepIcon className="w-12 h-12 text-primary" />
              </motion.div>
            </AnimatePresence>
          </motion.div>
          
          {/* Scanning Rings */}
          <div className="absolute inset-0 -m-4">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0, 0.4, 0], scale: [0.8, 1.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
                className="absolute inset-0 border border-primary/30 rounded-[40px]"
              />
            ))}
          </div>
        </div>

        {/* Text Area */}
        <div className="text-center mb-12">
          <h2 className="text-xl font-display font-bold mb-2 tracking-tight">AI 引擎正在深度解析...</h2>
          <p className="text-muted-foreground text-sm">千万级灵魂样本比对中，请稍候</p>
        </div>

        {/* Status Steps */}
        <div className="w-full space-y-4">
          {analysisSteps.map((step, idx) => {
            const isActive = idx === currentStep;
            const isCompleted = idx < currentStep;
            
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`flex items-center gap-4 p-3 rounded-2xl transition-colors duration-500 ${
                  isActive ? "bg-primary/5 border border-primary/10" : "bg-transparent"
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                   isCompleted ? "bg-primary text-primary-foreground" : 
                   isActive ? "bg-primary/20 text-primary animate-pulse" : 
                   "bg-muted text-muted-foreground"
                }`}>
                  {(() => {
                    const IconComp = iconMap[step.icon] || Sparkle;
                    return <IconComp className="w-5 h-5" />;
                  })()}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    isActive ? "text-foreground" : 
                    isCompleted ? "text-foreground/60" : 
                    "text-muted-foreground"
                  }`}>
                    {step.text}
                  </p>
                  {isActive && (
                    <motion.div 
                      layoutId="progress-bar"
                      className="h-1 bg-primary rounded-full mt-2 w-full origin-left overflow-hidden"
                    >
                      <motion.div
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-full w-1/2 bg-white/40"
                      />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </MobileLayout>
  );
};

export default QuizAnalyzingPage;

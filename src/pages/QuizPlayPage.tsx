import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import Header from "@/components/layout/Header";
import ProgressBar from "@/components/quiz/ProgressBar";
import ChoiceScale from "@/components/quiz/ChoiceScale";
import OptionButton from "@/components/quiz/OptionButton";
import { getQuizDef } from "@/data/registry";
import { useQuizStore } from "@/store/useQuizStore";
import { track } from "@/utils/analytics";

const QuizPlayPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  
  const setAnswer = useQuizStore(state => state.setAnswer);
  const calculateResult = useQuizStore(state => state.calculateResult);
  const answers = useQuizStore(state => state.answers);

  const quizDef = slug ? getQuizDef(slug) : null;
  const questions = quizDef?.questions || [];
  const question = questions[currentIndex];

  const quizStartTime = useRef<number>(Date.now());
  const questionStartTime = useRef<number>(Date.now());

  useEffect(() => {
    // Reset question timer when currentIndex changes
    questionStartTime.current = Date.now();
  }, [currentIndex]);

  useEffect(() => {
    if (!quizDef || !question) {
      navigate(`/quiz/${slug}`);
    }
  }, [quizDef, question, navigate, slug]);

  if (!quizDef || !question) {
    return <MobileLayout><div className="p-6">Loading...</div></MobileLayout>;
  }

  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswer = (optionIndex: number) => {
    const now = Date.now();
    const spentOnQuestion = (now - questionStartTime.current) / 1000; // in seconds

    if (quizDef && question) {
      track('quiz_answer', {
        quiz_id: quizDef.id,
        question_id: String(question.id),
        option_id: String(optionIndex),
        step_index: currentIndex,
        time_spent_on_question: spentOnQuestion
      });
    }

    setAnswer(question.id, optionIndex);

    if (currentIndex < questions.length - 1) {
      setDirection(1);
      setTimeout(() => setCurrentIndex(currentIndex + 1), 300);
    } else {
      if (quizDef) {
        const totalSpent = (now - quizStartTime.current) / 1000;
        track('quiz_complete', {
          quiz_id: quizDef.id,
          time_spent: totalSpent, 
          time_spent_total: totalSpent,
          result_key: 'pending' // Initial state
        });
        
        // Finalize and save to DB
        (async () => {
          await calculateResult(quizDef);
          navigate(`/quiz/${slug}/analyzing`);
        })();
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 100 : -100, opacity: 0, scale: 0.98 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d > 0 ? -100 : 100, opacity: 0, scale: 0.98 }),
  };

  return (
    <MobileLayout className="flex flex-col bg-background">
      <ProgressBar progress={progress} />
      
      <Header 
        showBack={true} 
        transparent 
        rightElement={
          <span className="text-sm font-display font-medium text-muted-foreground bg-muted/30 px-3 py-1 rounded-full border border-border/20">
            {currentIndex + 1} / {questions.length}
          </span>
        }
      />

      <div className="flex-1 flex flex-col px-6 pt-10 pb-8 overflow-hidden relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 350, damping: 35 }}
            className="flex-1 flex flex-col w-full h-full justify-start max-w-sm mx-auto"
          >
            <div className="mb-12 mt-4 text-center">
               <h2 className="font-display font-extrabold text-[1.4rem] leading-[1.4] text-foreground tracking-tight">
                  {question.text}
               </h2>
               <div className="mt-4 w-12 h-1 bg-primary/10 mx-auto rounded-full" />
            </div>

            <div className="flex-1 flex items-center justify-center">
              {question.type === 'spectrum' ? (
                <ChoiceScale 
                  selectedIndex={answers[String(question.id)] as number}
                  onSelect={handleAnswer} 
                />
              ) : (
                <div className="space-y-4 w-full">
                  {question.options.map((option, i) => (
                    <OptionButton
                      key={i}
                      label={option.label}
                      charIndex={i}
                      isSelected={answers[String(question.id)] === i}
                      onClick={() => handleAnswer(i)}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-6 py-6 border-t border-border/10 bg-background/50 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4">
          <button 
            className={`flex-1 py-4 px-4 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${
              currentIndex > 0 
                ? 'bg-secondary text-secondary-foreground btn-press' 
                : 'bg-muted/10 text-muted-foreground/40 cursor-not-allowed'
            }`}
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            <span>←</span>
            上一题
          </button>

          <div className="flex gap-2">
            <button
              className="w-12 h-12 rounded-2xl bg-primary/5 text-primary border border-primary/10 flex items-center justify-center btn-press"
              title="生成随机答案"
              onClick={() => {
                questions.forEach(q => {
                  const randomIdx = Math.floor(Math.random() * q.options.length);
                  setAnswer(q.id, randomIdx);
                });
                calculateResult(quizDef);
                navigate(`/quiz/${slug}/analyzing`);
              }}
            >
              <span className="text-xl">🪄</span>
            </button>

            <button
              className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 border border-orange-500/20 flex items-center justify-center btn-press group"
              title="生成极端情况答案"
              onClick={() => {
                questions.forEach(q => {
                  // For spectrum (5 levels), choose 0 or 4. For choice, choose 0.
                  const extremeIdx = q.type === 'spectrum' 
                    ? (Math.random() > 0.5 ? 0 : 4) 
                    : 0;
                  setAnswer(q.id, extremeIdx);
                });
                calculateResult(quizDef);
                navigate(`/quiz/${slug}/analyzing`);
              }}
            >
              <span className="text-xl group-hover:scale-125 transition-transform">🔥</span>
            </button>
          </div>
          
          <button 
            className={`flex-1 py-4 px-4 rounded-2xl font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all ${
              answers[String(question.id)] !== undefined
                ? 'gradient-primary text-primary-foreground btn-press'
                : 'bg-muted text-muted-foreground/50 cursor-not-allowed opacity-60'
            }`}
            onClick={() => {
              if (currentIndex < questions.length - 1) {
                setDirection(1);
                setCurrentIndex(currentIndex + 1);
              } else {
                calculateResult(quizDef);
                navigate(`/quiz/${slug}/analyzing`);
              }
            }}
            disabled={answers[String(question.id)] === undefined}
          >
            {currentIndex === questions.length - 1 ? "查看报告" : "下一题"}
            <span>→</span>
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default QuizPlayPage;

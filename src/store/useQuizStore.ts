// src/store/useQuizStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QuizDefinition, DimensionKey, QuizResultRule } from '@/data/quiz-schema';
import { supabase } from '@/lib/supabase';

export interface User {
  id: string;
  nickname: string;
  avatar?: string;
  isVip: boolean;
  joinDays: number;
  stats: {
    soulThickness: number;
    completedCount: number;
  };
}

export interface CompletedReport {
  id?: string; // DB ID
  quizId: string;
  timestamp: number;
  result: QuizResultRule;
  professionalScores: Record<DimensionKey, number>;
  rarity: number;
  synergyTags: any[];
  dominantTraits: any[];
  dimensionPairs: any[];
  coreAdvantages: any[];
  isBalanced: boolean;
}

export interface QuizState {
  user: User | null;
  currentQuizId: string | null;
  
  // Record of Question ID -> Option Index selected
  answers: Record<string, number>; 
  
  // Computed Result after finishing (Latest)
  finalResult: QuizResultRule | null;
  finalScores: Record<DimensionKey, number>;
  professionalScores: Record<DimensionKey, number>;
  
  // Hyper-Personalized metadata
  rarity: number; 
  synergyTags: Array<{ 
    title: string; 
    reason: string;
    q1: string; a1: string;
    q2: string; a2: string;
  }>; 
  dominantTraits: Array<{ dim: string; label: string; value: number; intensity: 'high' | 'low'; comment: string }>;
  dimensionPairs: any[];
  coreAdvantages: Array<{ icon: string; title: string; desc: string }>;
  isBalanced: boolean; 
  completedReports: CompletedReport[];
  isVip: boolean; // Legacy but kept for compatibility, prefer user.isVip
  
  // Actions
  login: (nickname: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  startQuiz: (quizId: string) => void;
  setAnswer: (questionId: string | number, optionIndex: number | string) => void;
  calculateResult: (quizDef: QuizDefinition) => Promise<void>;
  resetQuiz: () => void;
  loadReportFromHistory: (report: CompletedReport) => void;
  setVip: (value: boolean) => Promise<void>;
  fetchUserHistory: () => Promise<void>;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      user: null,
      currentQuizId: null,
      answers: {},
      finalResult: null,
      finalScores: {},
      professionalScores: {},
      rarity: 0,
      synergyTags: [] as Array<{ title: string; reason: string; q1: string; a1: string; q2: string; a2: string }>,
      dominantTraits: [],
      dimensionPairs: [],
      coreAdvantages: [],
      isBalanced: false,
      completedReports: [],
      isVip: false,

      login: async (nickname) => {
        const userId = `U-${Math.floor(Math.random() * 90000) + 10000}`; // Still random for demo, real auth would use supabase.auth
        const newUser: User = {
          id: userId,
          nickname,
          isVip: false,
          joinDays: 1,
          stats: {
            soulThickness: 42,
            completedCount: get().completedReports.length
          }
        };
        
        set({ user: newUser });

        // Sync to Supabase Profiles if configured (Non-blocking)
        try {
          await supabase.from('profiles').upsert({
            id: userId,
            nickname: nickname,
            is_vip: false
          });
        } catch (e) {
          console.warn('[Supabase] Sync failed, keeping local-only', e);
        }
      },

      updateProfile: async (updates) => {
        const state = get();
        if (!state.user) return;

        const updatedUser = { ...state.user, ...updates };
        set({ 
          user: updatedUser,
          isVip: updates.isVip !== undefined ? updates.isVip : state.isVip
        });

        // Sync to Supabase
        try {
          await supabase.from('profiles').update({
            nickname: updatedUser.nickname,
            is_vip: updatedUser.isVip
          }).eq('id', state.user.id);
        } catch (e) {
          console.warn('[Supabase] Profile sync failed', e);
        }
      },

      startQuiz: (quizId) => {
        set({ 
          currentQuizId: quizId, 
          answers: {}, 
          finalResult: null, 
          finalScores: {}, 
          professionalScores: {},
          rarity: 0, 
          synergyTags: [] as Array<{ title: string; reason: string; q1: string; a1: string; q2: string; a2: string }>, 
          dominantTraits: [], 
          dimensionPairs: [],
          coreAdvantages: [],
          isBalanced: false 
        });
      },
      
      setVip: async (value) => {
        const state = get();
        set({ 
          isVip: value,
          user: state.user ? { ...state.user, isVip: value } : null
        });

        if (state.user) {
          try {
            await supabase.from('profiles').update({ is_vip: value }).eq('id', state.user.id);
          } catch (e) {
            console.error('[Supabase] Failed to update VIP status', e);
          }
        }
      },

      fetchUserHistory: async () => {
        const state = get();
        if (!state.user) return;

        try {
          const { data, error } = await supabase
            .from('quiz_reports')
            .select('*')
            .eq('user_id', state.user.id);

          if (error) throw error;
          if (data) {
            const mappedReports: CompletedReport[] = data.map(db => ({
              id: db.id,
              quizId: db.quiz_id,
              timestamp: new Date(db.created_at).getTime(),
              result: db.metadata.result,
              professionalScores: db.professional_scores,
              rarity: db.metadata.rarity,
              synergyTags: db.metadata.synergyTags,
              dominantTraits: db.metadata.dominantTraits,
              dimensionPairs: db.metadata.dimensionPairs,
              coreAdvantages: db.metadata.coreAdvantages,
              isBalanced: db.metadata.isBalanced
            }));
            set({ completedReports: mappedReports });
          }
        } catch (e) {
          console.error('[Supabase] Failed to fetch history', e);
        }
      },

      setAnswer: (questionId, optionIndex) => {
        set((state) => ({
          answers: { ...state.answers, [String(questionId)]: Number(optionIndex) }
        }));
      },

      calculateResult: async (quizDef) => {
        const { answers, completedReports, user } = get();
        const rawScores: Record<string, number> = {};

        // 1. Calculate raw aggregated scores ... (Same logic as before)
        quizDef.questions.forEach(q => {
          const selectedOptionIndex = answers[String(q.id)];
          if (selectedOptionIndex !== undefined) {
            const option = q.options[selectedOptionIndex];
            if (option?.scores) {
              Object.entries(option.scores).forEach(([dim, points]) => {
                rawScores[dim] = (rawScores[dim] || 0) + (points as number);
              });
            }
          }
        });

        let matchedResult = quizDef.results.find(rule => rule.condition(rawScores));
        if (!matchedResult) matchedResult = quizDef.results.find(r => r.id === quizDef.defaultResultId) || quizDef.results[0];

        const professionalScores: Record<string, number> = {};
        quizDef.dimensions.forEach(dim => {
          const raw = rawScores[dim.key] || 0;
          let basePercent = (raw / 10) * 100;
          if (basePercent < 15) basePercent = 15 + (Math.random() * 5);
          if (basePercent > 95) basePercent = 95 + (Math.random() * 4);
          professionalScores[dim.key] = Number(basePercent.toFixed(1));
        });

        const rarity = quizDef.rarityData?.map?.[matchedResult.id] ?? 5.0;

        const sortedDims = [...quizDef.dimensions]
          .sort((a, b) => (professionalScores[b.key] || 0) - (professionalScores[a.key] || 0))
          .slice(0, 3);
        
        const coreAdvantages = sortedDims
          .map(d => quizDef.advantageLib?.[d.key])
          .filter(Boolean) as Array<{ icon: string; title: string; desc: string }>;

        const dimPairs = quizDef.dimensionPairs?.map(p => ({
          key: p.key,
          labelLeft: p.labelLeft,
          labelRight: p.labelRight,
          value: (professionalScores[p.dimRight] / ((professionalScores[p.dimLeft] || 1) + professionalScores[p.dimRight])) * 100,
          colorLeft: p.colorLeft,
          colorRight: p.colorRight
        })) || [];

        const newReport: CompletedReport = {
          quizId: quizDef.id,
          timestamp: Date.now(),
          result: matchedResult,
          professionalScores,
          rarity,
          synergyTags: [],
          dominantTraits: [],
          dimensionPairs: dimPairs,
          coreAdvantages: coreAdvantages,
          isBalanced: false
        };

        const filteredReports = completedReports.filter(r => r.quizId !== quizDef.id);
        const allReports = [...filteredReports, newReport];

        set({ 
          finalScores: rawScores,
          professionalScores: professionalScores,
          finalResult: matchedResult,
          rarity,
          dimensionPairs: dimPairs,
          coreAdvantages: coreAdvantages,
          completedReports: allReports
        });

        // Sync to Supabase
        if (user) {
          try {
            await supabase.from('quiz_reports').insert({
              user_id: user.id,
              quiz_id: quizDef.id,
              result_id: matchedResult.id,
              scores: rawScores,
              professional_scores: professionalScores,
              metadata: {
                result: matchedResult,
                rarity,
                synergyTags: [],
                dominantTraits: [],
                dimensionPairs: dimPairs,
                coreAdvantages,
                isBalanced: false
              }
            });
          } catch (e) {
            console.error('[Supabase] Failed to save report', e);
          }
        }
      },

      loadReportFromHistory: (report: CompletedReport) => {
        set({
          currentQuizId: report.quizId,
          finalResult: report.result,
          professionalScores: report.professionalScores,
          rarity: report.rarity,
          synergyTags: report.synergyTags,
          dominantTraits: report.dominantTraits,
          dimensionPairs: report.dimensionPairs,
          coreAdvantages: report.coreAdvantages,
          isBalanced: report.isBalanced,
        });
      },

      resetQuiz: () => {
        set({ 
          currentQuizId: null, 
          answers: {}, 
          finalResult: null, 
          finalScores: {},
          professionalScores: {},
          rarity: 0,
          synergyTags: [] as Array<{ title: string; reason: string; q1: string; a1: string; q2: string; a2: string }>,
          dominantTraits: [],
          dimensionPairs: [],
          coreAdvantages: [],
          isBalanced: false
        });
      },
    }),
    {
      name: 'testar-quiz-storage',
      partialize: (state) => ({ 
        user: state.user,
        completedReports: state.completedReports,
        currentQuizId: state.currentQuizId,
        answers: state.answers,
        finalResult: state.finalResult,
        finalScores: state.finalScores,
        professionalScores: state.professionalScores,
        rarity: state.rarity,
        synergyTags: state.synergyTags,
        dominantTraits: state.dominantTraits,
        dimensionPairs: state.dimensionPairs,
        coreAdvantages: state.coreAdvantages,
        isBalanced: state.isBalanced,
        isVip: state.isVip
      }),
    }
  )
);

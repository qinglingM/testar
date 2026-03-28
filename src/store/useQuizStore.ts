import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QuizDefinition, DimensionKey, QuizResultRule } from '@/data/quiz-schema';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface User {
  id: string;
  nickname: string;
  avatar?: string;
  isVip: boolean;
  isBaseVip: boolean;
  isTmax: boolean;
  dailyTestCount: number;
  lastTestDate?: string;
  joinDays: number;
  stats: {
    soulThickness: number;
    completedCount: number;
  };
}

export interface QuizResult {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  image?: string;
  cityBaseline?: Record<string, number> | string;
}

export interface SynergyTag {
  title: string;
  reason: string;
  q1: string;
  a1: string;
  q2: string;
  a2: string;
}

export interface DominantTrait {
  dim: string;
  label: string;
  value: number;
  intensity: 'high' | 'low';
  comment: string;
}

export interface DimensionPairResult {
  key: string;
  labelLeft: string;
  labelRight: string;
  value: number;
  colorLeft: string;
  colorRight: string;
}

export interface CompletedReport {
  quizId: string;
  timestamp: number;
  result: QuizResult;
  professionalScores: Record<string, number>;
  rarity: number;
  synergyTags: SynergyTag[];
  dominantTraits: DominantTrait[];
  dimensionPairs: DimensionPairResult[];
  coreAdvantages: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
  isBalanced: boolean;
  careerTips: string[];
  relationshipAdvice: string;
  metadata?: Record<string, unknown>;
}

export interface SignUpResult {
  requiresEmailConfirmation: boolean;
}

export interface ActivationVerificationResult {
  ok: boolean;
  message: string;
  tier?: string;
  effectiveTier?: string;
}

interface QuizState {
  // Session / User Data
  user: User | null;
  completedReports: CompletedReport[];
  isVip: boolean;      
  isBaseVip: boolean;  
  isTmax: boolean;
  dailyTestCount: number;
  
  // Current Quiz State
  currentQuizId: string | null;
  answers: Record<string, number>;
  finalResult: QuizResult | null;
  finalScores: Record<string, number>;
  professionalScores: Record<string, number>;
  rarity: number;
  synergyTags: SynergyTag[];
  dominantTraits: DominantTrait[];
  dimensionPairs: DimensionPairResult[];
  coreAdvantages: Array<{ title: string; description: string; icon?: string }>;
  isBalanced: boolean;
  careerTips: string[];
  relationshipAdvice: string;

  // Actions
  hydrateSession: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, nickname?: string) => Promise<SignUpResult>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;

  startQuiz: (quizId: string) => void;
  setAnswer: (questionId: string | number, optionIndex: number | string) => void;
  calculateResult: (quizDef: QuizDefinition) => Promise<void>;
  resetQuiz: () => void;

  verifyActivationCode: (code: string, context?: 'start' | 'upgrade') => Promise<ActivationVerificationResult>;
  incrementTestUsage: () => Promise<{ ok: boolean; message?: string }>;

  fetchUserHistory: () => Promise<void>;
  loadReportFromHistory: (report: CompletedReport) => void;

  reportSavingStatus: 'idle' | 'saving' | 'success' | 'error';
}

/**
 * 集中管理重置邏輯，防止 Session 偽裝
 */
const INITIAL_QUIZ_STATE = {
  currentQuizId: null,
  answers: {},
  finalResult: null,
  finalScores: {},
  professionalScores: {},
  rarity: 0,
  synergyTags: [],
  dominantTraits: [],
  dimensionPairs: [],
  coreAdvantages: [],
  isBalanced: false,
  careerTips: [],
  relationshipAdvice: "",
  reportSavingStatus: 'idle' as const,
};

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      // --- Initialization & Sync (SSOT) ---
      
      hydrateSession: async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            await get().refreshProfile();
          } else {
            // Authentication lost? Scrub ALL session/private data
            set({ 
              user: null, 
              isVip: false, 
              isBaseVip: false, 
              isTmax: false, 
              dailyTestCount: 0,
              completedReports: [],
              ...INITIAL_QUIZ_STATE
            });
          }
        } catch (e) {
          console.error('[Auth] Session hydration failed', e);
        }
      },

      refreshProfile: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error && error.code !== 'PGRST116') throw error;

          if (profile) {
            const metadata = (profile.metadata as Record<string, unknown>) || {};
            const user: User = {
              id: session.user.id,
              nickname: profile.nickname || session.user.email?.split('@')[0] || '探测者',
              avatar: profile.avatar_url,
              isVip: profile.is_vip || false,
              isBaseVip: (metadata.is_base_vip as boolean) || false,
              isTmax: profile.is_tmax || false,
              dailyTestCount: profile.daily_test_count || 0,
              lastTestDate: profile.last_test_date,
              joinDays: Math.ceil((Date.now() - new Date(session.user.created_at).getTime()) / (1000 * 60 * 60 * 24)),
              stats: {
                soulThickness: 42,
                completedCount: profile.completed_count || 0,
              }
            };
            set({ 
              user, 
              isVip: user.isVip, 
              isBaseVip: user.isBaseVip,
              isTmax: user.isTmax,
              dailyTestCount: user.dailyTestCount
            });
          }
        } catch (e) {
          console.error('[Membership] Profile sync failed', e);
        }
      },

      // --- Current State Values ---
      user: null,
      ...INITIAL_QUIZ_STATE,
      completedReports: [],
      isVip: false,
      isBaseVip: false,
      isTmax: false,
      dailyTestCount: 0,

      // --- Auth & Account ---
      login: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        if (data.user) {
          await get().refreshProfile();
          
          // Background update last_login
          supabase.from('profiles')
            .update({ last_login_at: new Date().toISOString() })
            .eq('id', data.user.id)
            .then();
        }
      },

      signUp: async (email, password, nickname) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { nickname: nickname || email.split('@')[0] } },
        });

        if (error) throw error;
        if (!data.user) throw new Error('注册失败');

        // Ensure profile exists immediately
        await supabase.from('profiles').upsert({
          id: data.user.id,
          nickname: nickname || email.split('@')[0],
          email: email,
          is_vip: false,
          is_tmax: false,
          daily_test_count: 0,
        }, { onConflict: 'id' });

        await get().hydrateSession();
        return { requiresEmailConfirmation: false };
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ 
          user: null, 
          isVip: false, 
          isBaseVip: false, 
          isTmax: false, 
          dailyTestCount: 0, 
          completedReports: [],
          ...INITIAL_QUIZ_STATE
        });
      },

      updateProfile: async (updates) => {
        const state = get();
        if (!state.user) return;

        try {
          const { error } = await supabase.from('profiles').update({
            nickname: updates.nickname,
            is_vip: updates.isVip
          }).eq('id', state.user.id);

          if (error) throw error;
          await get().refreshProfile();
        } catch (e) {
          console.warn('[Membership] Profile update sync failed', e);
        }
      },

      // --- Quiz Session ---
      startQuiz: (quizId) => {
        set({ ...INITIAL_QUIZ_STATE, currentQuizId: quizId });
      },

      setAnswer: (questionId, optionIndex) => {
        set((state) => ({
          answers: { ...state.answers, [String(questionId)]: Number(optionIndex) }
        }));
      },

      calculateResult: async (quizDef) => {
        const { answers, user } = get();
        set({ reportSavingStatus: 'saving' });

        const rawScores: Record<string, number> = {};
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
          .map(d => {
            const adv = quizDef.advantageLib?.[d.key];
            if (!adv) return null;
            return {
              title: adv.title,
              description: (adv as { desc: string }).desc || "",
              icon: adv.icon
            };
          })
          .filter(Boolean) as Array<{ title: string; description: string; icon?: string }>;

        const dimPairs = quizDef.dimensionPairs?.map(p => ({
          key: p.key, labelLeft: p.labelLeft, labelRight: p.labelRight,
          value: (professionalScores[p.dimRight] / ((professionalScores[p.dimLeft] || 1) + professionalScores[p.dimRight])) * 100,
          colorLeft: p.colorLeft, colorRight: p.colorRight
        })) || [];

        const synergyTags: SynergyTag[] = [];
        if (quizDef.synergyRules) {
          quizDef.synergyRules.forEach(rule => {
            const isMatch = rule.trigger.every(t => {
              const userAns = answers[String(t.qId)];
              return t.optIdx.includes(userAns);
            });
            if (isMatch) {
              const q1 = quizDef.questions.find(q => String(q.id) === String(rule.trigger[0].qId));
              const a1 = q1?.options[answers[String(rule.trigger[0].qId)]]?.label;
              const q2 = rule.trigger[1] ? quizDef.questions.find(q => String(q.id) === String(rule.trigger[1].qId)) : null;
              const a2 = q2 ? q2.options[answers[String(rule.trigger[1].qId)]]?.label : "";

              synergyTags.push({
                title: rule.title, reason: rule.reason,
                q1: q1?.text || "", a1: a1 || "",
                q2: q2?.text || "", a2: a2 || ""
              });
            }
          });
        }

        const dominantTraits: DominantTrait[] = [];
        if (quizDef.polarizationLib) {
          Object.entries(professionalScores).forEach(([dim, score]) => {
            const lib = quizDef.polarizationLib![dim];
            if (lib && (score > 80 || score < 20)) {
              dominantTraits.push({
                dim, label: lib.label, value: score,
                intensity: score > 80 ? 'high' : 'low',
                comment: score > 80 ? lib.high : lib.low
              });
            }
          });
        }
        
        const newReport: CompletedReport = {
          quizId: quizDef.id,
          timestamp: Date.now(),
          result: matchedResult,
          professionalScores,
          rarity,
          synergyTags,
          dominantTraits,
          dimensionPairs: dimPairs,
          coreAdvantages,
          isBalanced: Object.values(professionalScores).every(s => Math.abs(s - 50) < 15),
          careerTips: sortedDims.map(d => quizDef.advantageLib?.[d.key]?.shortage).filter(Boolean) as string[],
          relationshipAdvice: "与同类型的灵魂相遇时，你们会瞬间产生共振；而在互补型灵魂面前，你是那个温柔的引领者。"
        };

        set({ 
          finalScores: rawScores,
          professionalScores,
          finalResult: matchedResult,
          rarity, synergyTags, dominantTraits, dimensionPairs: dimPairs, coreAdvantages,
          isBalanced: newReport.isBalanced,
          careerTips: newReport.careerTips,
          relationshipAdvice: newReport.relationshipAdvice,
          reportSavingStatus: 'saving' 
        });

        if (user) {
          try {
            const { error: dbError } = await supabase.from('quiz_reports').insert({
              user_id: user.id,
              quiz_id: quizDef.id,
              result_id: matchedResult.id,
              scores: rawScores,
              professional_scores: professionalScores,
              metadata: { ...newReport, isVipOnSave: get().isVip }
            });

            if (dbError) throw dbError;
            
            set({ reportSavingStatus: 'success' });
            await get().fetchUserHistory();
          } catch (e) {
            console.error('[Reports] Save failed', e);
            set({ reportSavingStatus: 'error' });
            toast.error("报告保存失败，请检查网络连接", { description: "您可以截图保存当前结果" });
          }
        } else {
          set({ reportSavingStatus: 'success' });
        }
      },

      loadReportFromHistory: (report) => {
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
          careerTips: report.careerTips,
          relationshipAdvice: report.relationshipAdvice,
        });
      },

      resetQuiz: () => {
        set({ ...INITIAL_QUIZ_STATE });
      },

      // --- Membership & History ---
      verifyActivationCode: async (code, context) => {
        const state = get();
        const cleanCode = code.trim().toUpperCase();

        if (!state.user) return { ok: false, message: '请先登录后再激活' };

        if (context === 'start' && cleanCode.startsWith('UPGD')) return { ok: false, message: '升级码仅限在结果页使用' };
        if (context === 'upgrade' && (cleanCode.startsWith('BASI') || cleanCode.startsWith('TPRO'))) return { ok: false, message: '该码仅限在入口处使用' };

        try {
          const { data, error } = await supabase.functions.invoke('verify-activation-code', {
            body: { code: cleanCode },
          });

          // DEBUG LOG - Help the user see what's actually happening
          console.log('[DEBUG] Activation Result:', { data, error });

          if (error) {
            // Extract error body if available
            const errMsg = error.message === 'Edge Function returned a non-2xx status code' 
              ? '后端函数执行异常 (500/CORS)，请检查 Supabase 控制台日志' 
              : (error?.context?.message || error?.message || '激活请求失败');
            return { ok: false, message: errMsg };
          }
          
          if (!data || !data.ok) {
            return { ok: false, message: data?.message || '激活码可能已失效，请联系客服' };
          }

          await get().refreshProfile();

          return {
            ok: true,
            message: data?.message || '激活成功',
            tier: data?.tier as string,
            effectiveTier: data?.effective_tier as string,
          };
        } catch (e: unknown) {
          console.error('[Membership] Activation Exception', e);
          const msg = e instanceof Error ? e.message : '系統繁忙，請稍後重試';
          return { ok: false, message: msg };
        }
      },

      incrementTestUsage: async () => {
        const state = get();
        if (!state.user) return { ok: false };
        try {
          const { data, error } = await supabase.rpc('increment_test_usage', { user_id_param: state.user.id });
          if (error) throw error;
          await get().refreshProfile();
          return { ok: data as boolean };
        } catch (e) {
          console.error('[Usage] Increment failed', e);
          return { ok: false };
        }
      },

      fetchUserHistory: async () => {
        const { user } = get();
        if (!user) return;

        try {
          const { data, error } = await supabase
            .from('quiz_reports')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;

          if (data) {
            const reports = data.map((item) => (item.metadata as unknown) as CompletedReport);
            set({ completedReports: reports });
          }
        } catch (e) {
          console.error('[History] Failed to fetch', e);
        }
      },
    }),
    {
      name: 'testar-quiz-storage',
      partialize: (state) => ({ 
        completedReports: state.completedReports,
        currentQuizId: state.currentQuizId,
        answers: state.answers,
        finalResult: state.finalResult,
      }),
    }
  )
);

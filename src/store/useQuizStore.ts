// src/store/useQuizStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QuizDefinition, DimensionKey, QuizResultRule } from '@/data/quiz-schema';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface User {
  id: string;
  nickname: string;
  avatar?: string;
  isVip: boolean;      // For PRO/TPRO
  isBaseVip: boolean;  // For BASI
  isTmax: boolean;    // For Yearly TMAX
  dailyTestCount: number;
  lastTestDate?: string;
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
  careerTips?: string[];
  relationshipAdvice?: string;
  metadata?: any;
}

export interface ActivationVerificationResult {
  ok: boolean;
  message: string;
  grantedPro?: boolean;
  grantedBase?: boolean;
  grantedTmax?: boolean;
  tier?: 'basi' | 'upgd' | 'tpro' | 'tmax';
  effectiveTier?: string;
}

export interface SignUpResult {
  requiresEmailConfirmation: boolean;
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
  careerTips: string[];
  relationshipAdvice: string;
  completedReports: CompletedReport[];
  isVip: boolean;      
  isBaseVip: boolean;  
  isTmax: boolean;
  dailyTestCount: number;
  
  // Actions
  // --- Auth & Account ---
  hydrateSession: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, nickname?: string) => Promise<SignUpResult>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;

  // --- Quiz Session ---
  startQuiz: (quizId: string) => void;
  setAnswer: (questionId: string | number, optionIndex: number | string) => void;
  calculateResult: (quizDef: QuizDefinition) => Promise<void>;
  resetQuiz: () => void;

  // --- Membership ---
  verifyActivationCode: (code: string, context?: 'start' | 'upgrade') => Promise<ActivationVerificationResult>;
  incrementTestUsage: () => Promise<{ ok: boolean; message?: string }>;

  // --- Reports & History ---
  fetchUserHistory: () => Promise<void>;
  loadReportFromHistory: (report: CompletedReport) => void;

  // --- UI/Status ---
  reportSavingStatus: 'idle' | 'saving' | 'success' | 'error';
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      // --- Initialization & Sync (SSOT) ---
      
      /**
       * 应用启动或 Auth 变更时调用：以 session 为准同步用户信息
       */
      hydrateSession: async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            await get().refreshProfile();
          } else {
            // No session? Clear everything.
            set({ 
              user: null, 
              isVip: false, 
              isBaseVip: false, 
              isTmax: false, 
              dailyTestCount: 0 
            });
          }
        } catch (e) {
          console.error('[Auth] Session hydration failed', e);
        }
      },

      /**
       * 强制从服务端拉取最新的 profile 数据，作为唯一的会员态真相源
       */
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
            const user: User = {
              id: session.user.id,
              nickname: profile.nickname || session.user.email?.split('@')[0] || '探测者',
              avatar: profile.avatar_url,
              isVip: profile.is_vip || false,
              isBaseVip: (profile.metadata as any)?.is_base_vip || false,
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
      careerTips: [],
      relationshipAdvice: "",
      completedReports: [],
      isVip: false,
      isBaseVip: false,
      isTmax: false,
      dailyTestCount: 0,
      reportSavingStatus: 'idle',

      // --- Auth & Account ---

      login: async (email, password) => {
        try {
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
        } catch (e: any) {
          throw e;
        }
      },

      signUp: async (email, password, nickname) => {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { nickname: nickname || email.split('@')[0] } },
          });

          if (error) throw error;
          if (!data.user) throw new Error('注册失败');

          // Ensure profile exists
          await supabase.from('profiles').upsert({
            id: data.user.id,
            nickname: nickname || email.split('@')[0],
            email: email,
            is_vip: false,
            is_tmax: false,
            daily_test_count: 0,
          }, { onConflict: 'id' });

          // Auto-login or hydrate
          await get().hydrateSession();

          return { requiresEmailConfirmation: false };
        } catch (e: any) {
          console.error('[Auth] SignUp failed', e);
          throw e;
        }
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ 
          user: null, 
          isVip: false, 
          isBaseVip: false, 
          isTmax: false, 
          dailyTestCount: 0, 
          completedReports: [] 
        });
        // Full storage clear if needed, but persist handles general reset
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
          isBalanced: false,
          careerTips: [],
          relationshipAdvice: ""
        });
      },
      
      // --- Membership ---
      
      /** 
       * @deprecated 支付链路已弃用，统一使用 verifyActivationCode
       */
      setVip: async () => { console.warn('setVip is deprecated. Use verifyActivationCode.'); },
      setBaseVip: async () => { console.warn('setBaseVip is deprecated.'); },

      verifyActivationCode: async (code: string, context?: 'start' | 'upgrade') => {
        const state = get();
        const cleanCode = code.trim().toUpperCase();

        if (!state.user) return { ok: false, message: '请先登录后再激活' };

        // Entrance constraints
        if (context === 'start' && cleanCode.startsWith('UPGD')) return { ok: false, message: '升级码仅限在结果页使用' };
        if (context === 'upgrade' && (cleanCode.startsWith('BASI') || cleanCode.startsWith('TPRO'))) return { ok: false, message: '该码仅限在入口处使用' };

        try {
          const { data, error } = await supabase.functions.invoke('verify-activation-code', {
            body: { code: cleanCode },
          });

          if (error) throw error;
          if (!data?.ok) return { ok: false, message: data?.message || '激活失败' };

          // === KEY SYNC POINT ===
          // 不再手动 set 本地状态，强制从服务端同步最新的 profile 权限
          await get().refreshProfile();

          return {
            ok: true,
            message: data?.message || '激活成功',
            tier: data?.tier,
            effectiveTier: data?.effective_tier,
          };
        } catch (e: any) {
          return { ok: false, message: e?.message || '系统繁忙，请稍后刷新重试' };
        }
      },

      incrementTestUsage: async () => {
        const state = get();
        if (!state.user || !state.isTmax) return { ok: true };

        try {
          const { data, error } = await supabase.functions.invoke('increment-test-usage', {
            body: { user_id: state.user.id }
          });
          if (!error && data?.ok) {
            set({ dailyTestCount: data.count || state.dailyTestCount + 1 });
            return { ok: true };
          }
          return { ok: false, message: data?.message || '达到每日限额' };
        } catch (e) {
          return { ok: true }; // Network fallback
        }
      },

      // --- Reports & History ---

      fetchUserHistory: async () => {
        const state = get();
        if (!state.user) return;

        try {
          const { data, error } = await supabase
            .from('quiz_reports')
            .select('*')
            .eq('user_id', state.user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;
          if (data) {
            const mappedReports = data.map(db => ({
              id: db.id,
              quizId: db.quiz_id,
              timestamp: new Date(db.created_at || Date.now()).getTime(),
              result: db.metadata?.result || {},
              professionalScores: db.professional_scores || {},
              rarity: db.metadata?.rarity || 5.0,
              synergyTags: db.metadata?.synergyTags || [],
              dominantTraits: db.metadata?.dominantTraits || [],
              dimensionPairs: db.metadata?.dimensionPairs || [],
              coreAdvantages: db.metadata?.coreAdvantages || [],
              isBalanced: db.metadata?.isBalanced || false,
              careerTips: db.metadata?.careerTips || [],
              relationshipAdvice: db.metadata?.relationshipAdvice || "",
              metadata: db.metadata || {}
            }));
            
            set({ completedReports: mappedReports });
          }
        } catch (e) {
          console.error('[History] Fetch failed', e);
        }
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
          .map(d => quizDef.advantageLib?.[d.key])
          .filter(Boolean) as any[];

        const dimPairs = quizDef.dimensionPairs?.map(p => ({
          key: p.key, labelLeft: p.labelLeft, labelRight: p.labelRight,
          value: (professionalScores[p.dimRight] / ((professionalScores[p.dimLeft] || 1) + professionalScores[p.dimRight])) * 100,
          colorLeft: p.colorLeft, colorRight: p.colorRight
        })) || [];

        // Logic for synergyTags, dominantTraits... (keep existing logic but save it carefully)
        // ... omitted for brevity in chunk but exists in full file ...
        const synergyTags: any[] = [];
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

        const dominantTraits: any[] = [];
        if (quizDef.polarizationLib) {
          Object.entries(professionalScores).forEach(([dim, score]) => {
            const lib = quizDef.polarizationLib![dim];
            if (lib && (score > 80 || score < 20)) {
              dominantTraits.push({
                dim,
                label: lib.label,
                value: score,
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
          coreAdvantages: coreAdvantages,
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
          careerTips: newReport.careerTips || [],
          relationshipAdvice: newReport.relationshipAdvice || "",
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
            await get().fetchUserHistory(); // 成功后刷新云端历史记录
          } catch (e) {
            console.error('[Reports] Save failed', e);
            set({ reportSavingStatus: 'error' });
            toast.error("报告保存失败，请检查网络连接", { description: "您可以截图保存当前结果" });
          }
        } else {
          set({ reportSavingStatus: 'success' });
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
          careerTips: report.careerTips || [],
          relationshipAdvice: report.relationshipAdvice || "",
        });
      },

      resetQuiz: () => {
        set({ 
          currentQuizId: null, answers: {}, finalResult: null, finalScores: {}, professionalScores: {},
          rarity: 0, synergyTags: [], dominantTraits: [], dimensionPairs: [], coreAdvantages: [],
          isBalanced: false, careerTips: [], relationshipAdvice: "",
          reportSavingStatus: 'idle'
        });
      },
    }),
    {
      name: 'testar-quiz-storage',
      partialize: (state) => ({ 
        // 仅保留基础状态，登录态和会员态由 App.tsx 的 hydrateSession 在启动时重新同步
        completedReports: state.completedReports,
        currentQuizId: state.currentQuizId,
        answers: state.answers,
        finalResult: state.finalResult,
      }),
    }
  )
);

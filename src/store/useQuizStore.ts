// src/store/useQuizStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QuizDefinition, DimensionKey, QuizResultRule } from '@/data/quiz-schema';
import { supabase } from '@/lib/supabase';
import { isEmailRateLimitError } from '@/lib/authErrors';

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
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, nickname?: string) => Promise<SignUpResult>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  startQuiz: (quizId: string) => void;
  setAnswer: (questionId: string | number, optionIndex: number | string) => void;
  calculateResult: (quizDef: QuizDefinition) => Promise<void>;
  resetQuiz: () => void;
  loadReportFromHistory: (report: CompletedReport) => void;
  setVip: (value: boolean) => Promise<void>;
  setBaseVip: (value: boolean) => Promise<void>;
  verifyActivationCode: (code: string, context?: 'start' | 'upgrade') => Promise<ActivationVerificationResult>;
  incrementTestUsage: () => Promise<{ ok: boolean; message?: string }>;
  fetchUserHistory: () => Promise<void>;
  syncSession: () => Promise<void>;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      syncSession: async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            // Already handled by initial persist load potentially, 
            // but we fetch fresh profile data to be sure
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

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
          } else {
            // No session, clear user but keep result data if necessary (based on your preference)
            // set({ user: null });
          }
        } catch (e) {
          console.warn('[Supabase] Session sync failed', e);
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

      login: async (email, password) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;
          if (data.user) {
            // Fetch profile
            const { data: profile, error: pError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();

            if (pError && pError.code !== 'PGRST116') throw pError;

            const user: User = {
              id: data.user.id,
              nickname: profile?.nickname || email.split('@')[0],
              avatar: profile?.avatar_url,
              isVip: profile?.is_vip || false,
              isBaseVip: (profile?.metadata as any)?.is_base_vip || false,
              isTmax: profile?.is_tmax || false,
              dailyTestCount: profile?.daily_test_count || 0,
              lastTestDate: profile?.last_test_date,
              joinDays: Math.ceil((Date.now() - new Date(data.user.created_at).getTime()) / (1000 * 60 * 60 * 24)),
              stats: {
                soulThickness: 42,
                completedCount: 1,
              }
            };
            set({ 
              user, 
              isVip: user.isVip, 
              isBaseVip: user.isBaseVip,
              isTmax: user.isTmax,
              dailyTestCount: user.dailyTestCount
            });

            try {
              await supabase
                .from('profiles')
                .update({ last_login_at: new Date().toISOString() })
                .eq('id', data.user.id);
            } catch (e) {
              console.warn('[Supabase] Failed to update last login time', e);
            }
          }
        } catch (e: any) {
          throw e;
        }
      },

      signUp: async (email, password, nickname) => {
        try {
          // 1. Register with Supabase Auth (no email confirmation)
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                nickname: nickname || email.split('@')[0],
              },
            },
          });

          if (error) throw error;

          if (!data.user) {
            throw new Error('注册失败，未能创建用户');
          }

          // 2. Ensure profiles row exists with nickname
          try {
            const { error: profileError } = await supabase
              .from('profiles')
              .upsert({
                id: data.user.id,
                nickname: nickname || email.split('@')[0],
                email: email,
                is_vip: false,
                is_tmax: false,
                daily_test_count: 0,
              }, { onConflict: 'id' });

            if (profileError) {
              console.warn('[Supabase] Profile creation warning:', profileError.message);
            }
          } catch (profileErr) {
            console.warn('[Supabase] Profile upsert failed, continuing...', profileErr);
          }

          // 3. Auto-login immediately after registration
          if (data.session) {
            // Session already exists, set user state directly
            const user: User = {
              id: data.user.id,
              nickname: nickname || email.split('@')[0],
              avatar: undefined,
              isVip: false,
              isBaseVip: false,
              isTmax: false,
              dailyTestCount: 0,
              lastTestDate: undefined,
              joinDays: 1,
              stats: {
                soulThickness: 42,
                completedCount: 0,
              }
            };
            set({ 
              user, 
              isVip: false, 
              isBaseVip: false,
              isTmax: false,
              dailyTestCount: 0
            });
          } else {
            // No session returned, explicitly login
            await get().login(email, password);
          }

          return {
            requiresEmailConfirmation: false,
          };
        } catch (e: any) {
          console.error('[SignUp Error]', e);
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
          isBalanced: false,
          careerTips: [],
          relationshipAdvice: ""
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
            await supabase.from('profiles').update({
              is_vip: value,
            }).eq('id', state.user.id);
          } catch (e) {
            console.error('[Supabase] Failed to update VIP status', e);
          }
        }
      },

      setBaseVip: async (value: boolean) => {
        const state = get();
        set({ isBaseVip: value });
        if (state.user) {
          set({ user: { ...state.user, isBaseVip: value } });

          try {
            await supabase.from('profiles').update({
              metadata: { is_base_vip: value }
            }).eq('id', state.user.id);
          } catch (e) {
            console.error('[Supabase] Failed to update BASE status', e);
          }
        }
      },

      verifyActivationCode: async (code: string, context?: 'start' | 'upgrade') => {
        const state = get();
        const cleanCode = code.trim().toUpperCase();

        if (!state.user) {
          return { ok: false, message: '请先登录后再激活' };
        }

        // Entrance constraints
        if (context === 'start' && cleanCode.startsWith('UPGD')) {
          return { ok: false, message: '升级激活码仅限在测试结果页面使用' };
        }
        if (context === 'upgrade' && (cleanCode.startsWith('BASI') || cleanCode.startsWith('TPRO'))) {
          return { ok: false, message: '该激活码仅限在测试开始入口使用' };
        }

        try {
          const { data, error } = await supabase.functions.invoke('verify-activation-code', {
            body: { code: cleanCode },
          });

          if (error) {
            return { ok: false, message: error.message || '激活失败，请稍后重试' };
          }

          if (!data?.ok) {
            return { ok: false, message: data?.message || '激活失败' };
          }

          const result: ActivationVerificationResult = {
            ok: true,
            message: data?.message || '激活成功',
            grantedPro: Boolean(data?.is_vip),
            grantedBase: Boolean(data?.is_base_vip),
            grantedTmax: Boolean(data?.is_tmax),
            tier: data?.tier,
            effectiveTier: data?.effective_tier,
          };

          const nextIsVip = state.isVip || Boolean(result.grantedPro);
          const nextIsBaseVip = state.isBaseVip || Boolean(result.grantedBase);
          const nextIsTmax = state.isTmax || Boolean(result.grantedTmax);

          set({
            isVip: nextIsVip,
            isBaseVip: nextIsBaseVip,
            isTmax: nextIsTmax,
            user: state.user ? {
              ...state.user,
              isVip: nextIsVip,
              isBaseVip: nextIsBaseVip,
              isTmax: nextIsTmax,
            } : null,
          });

          return result;
        } catch (e: any) {
          return { ok: false, message: e?.message || '激活失败，请稍后重试' };
        }
      },

      incrementTestUsage: async () => {
        const state = get();
        if (!state.user) return { ok: false };
        if (!state.isTmax) return { ok: true }; // Not TMAX? Let it pass, they use codes.

        try {
          const { data, error } = await supabase.functions.invoke('increment-test-usage', {
            body: { user_id: state.user.id }
          });
          
          if (error) throw error;
          
          if (data?.ok) {
            set({ dailyTestCount: data.count || state.dailyTestCount + 1 });
            return { ok: true };
          } else {
            return { ok: false, message: data?.message || '达到每日限额' };
          }
        } catch (e: any) {
          console.error('[Membership] Error incrementing usage:', e);
          return { ok: true }; // Fallback to let them test on network error
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
            const rawMapped = data.map(db => ({
              id: db.id,
              quizId: db.quiz_id,
              timestamp: new Date(db.created_at || Date.now()).getTime(),
              result: db.metadata?.result || {},
              professionalScores: db.professional_scores || {},
              rarity: db.metadata?.rarity || 'Common',
              synergyTags: db.metadata?.synergyTags || [],
              dominantTraits: db.metadata?.dominantTraits || [],
              dimensionPairs: db.metadata?.dimensionPairs || [],
              coreAdvantages: db.metadata?.coreAdvantages || [],
              isBalanced: db.metadata?.isBalanced || false,
              metadata: db.metadata || {}
            }));
            
            // Re-order and assign consistent sequences (#01, #02...)
            const mappedReports = rawMapped
              .sort((a,b) => a.timestamp - b.timestamp)
              .map((r, i, all) => {
                 const matchingSequence = all.slice(0, i+1).filter(prev => prev.quizId === r.quizId).length;
                 const sequence = r.metadata?.sequence || matchingSequence;
                 const tag = ` #${String(sequence).padStart(2, '0')}`;
                 return {
                    ...r,
                    metadata: {
                      ...r.metadata,
                      sequence,
                      tag
                    }
                 };
              })
              .sort((a,b) => b.timestamp - a.timestamp);
            
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

        // 1. Calculate raw aggregated scores
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
                title: rule.title,
                reason: rule.reason,
                q1: q1?.text || "",
                a1: a1 || "",
                q2: q2?.text || "",
                a2: a2 || ""
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

        const isBalanced = Object.values(professionalScores).every(s => Math.abs(s - 50) < 15);

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
          isBalanced,
          careerTips: sortedDims.map(d => quizDef.advantageLib?.[d.key]?.shortage).filter(Boolean) as string[],
          relationshipAdvice: matchedResult.description.length > 50 ? matchedResult.description.slice(0, 50) + "..." : "在一段关系中，你的这种特质往往能成为对方最坚实的后盾。"
        };

        // Determine sequence for repeat tests
        const matchingReports = completedReports.filter(r => r.quizId === quizDef.id);
        const sequence = matchingReports.length + 1;
        const tag = ` #${String(sequence).padStart(2, '0')}`;
        
        // Update newReport with sequence info
        const reportWithSequence = {
          ...newReport,
          metadata: {
            ...newReport.metadata,
            sequence,
            tag,
            isVip: get().isVip || get().isBaseVip // Keep track of VIP status at time of test
          }
        };

        const allReports = [...completedReports, reportWithSequence];

        set({ 
          finalScores: rawScores,
          professionalScores: professionalScores,
          finalResult: matchedResult,
          rarity,
          synergyTags,
          dominantTraits,
          dimensionPairs: dimPairs,
          coreAdvantages: coreAdvantages,
          isBalanced,
          careerTips: newReport.careerTips || [],
          relationshipAdvice: newReport.relationshipAdvice || "",
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
                synergyTags,
                dominantTraits,
                dimensionPairs: dimPairs,
                coreAdvantages,
                isBalanced,
                careerTips: sortedDims.map(d => quizDef.advantageLib?.[d.key]?.shortage).filter(Boolean),
                relationshipAdvice: "与同类型的灵魂相遇时，你们会瞬间产生共振；而在互补型灵魂面前，你是那个温柔的引领者。",
                sequence,
                tag,
                isVip: get().isVip || get().isBaseVip
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
          careerTips: report.careerTips || [],
          relationshipAdvice: report.relationshipAdvice || "",
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
          isBalanced: false,
          careerTips: [],
          relationshipAdvice: ""
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
        careerTips: state.careerTips,
        relationshipAdvice: state.relationshipAdvice,
        isVip: state.isVip,
        isBaseVip: state.isBaseVip
      }),
    }
  )
);

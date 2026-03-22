import { QuizDefinition } from '../quiz-schema';
import careerCover from '@/assets/covers/career.png';
import careerIcon from '@/assets/icons/career.png';

const spectrumOptions = (posKey: string, negKey: string, weight = 1.0) => [
  { label: "完全不符合", scores: { [negKey]: 2 * weight } },
  { label: "不符合", scores: { [negKey]: 1 * weight } },
  { label: "中立", scores: {} },
  { label: "符合", scores: { [posKey]: 1 * weight } },
  { label: "非常符合", scores: { [posKey]: 2 * weight } },
];

export const careerQuiz: QuizDefinition = {
  id: 'career',
  title: '职业优势分析 (Holt)',
  subtitle: '挖掘你的职场隐藏天赋，找到最适合你的位置',
  coverImage: careerCover,
  icon: careerIcon,
  questionsCount: 16,
  participantsCount: '6.2万',
  estimatedMinutes: 4,
  visualization: 'spectrum',
  
  reportConfig: {
    topCardType: 'rarity',
    advantageMode: 'both'
  },

  dimensions: [
    { key: 'CRT', label: '创造力', colorClass: 'bg-yellow-500' },
    { key: 'EXC', label: '执行力', colorClass: 'bg-emerald-500' },
    { key: 'LD', label: '领导力', colorClass: 'bg-red-500' },
    { key: 'SP', label: '专业性', colorClass: 'bg-blue-500' },
  ],

  questions: [
    { id: 1, type: 'spectrum', text: "比起日复一日地执行既定流程，我更喜欢在充满不确定性的新领域开疆拓土。", options: spectrumOptions('CRT', 'EXC', 1.0) },
    { id: 2, type: 'spectrum', text: "我经常会有一些打破常规的想法，即便这些想法在目前的代码框架下很难实现。", options: spectrumOptions('CRT', 'EXC', 1.0) },
    { id: 3, type: 'spectrum', text: "比起成为某个深钻技术的专家，我更希望能统筹全局，带领团队拿到大的商业成果。", options: spectrumOptions('LD', 'SP', 1.0) },
    { id: 4, type: 'spectrum', text: "我享受那种坐在会议桌中心位，通过决策和授权来推进项目的权力感。", options: spectrumOptions('LD', 'SP', 1.0) },
    { id: 5, type: 'spectrum', text: "在项目遇到阻碍时，我总是第一个冲上前去解决具体执行层面的难题。", options: spectrumOptions('EXC', 'LD', 1.0) },
    { id: 6, type: 'spectrum', text: "我追求极致的技术方案，哪怕需要花费数倍的时间在打磨细节上。", options: spectrumOptions('SP', 'CRT', 1.0) },
    { id: 7, type: 'spectrum', text: "我擅长整合碎片资源，将看似无关的人和事通过商业逻辑串联起来。", options: spectrumOptions('LD', 'EXC', 1.0) },
    { id: 8, type: 'spectrum', text: "我讨厌平庸，总是尝试用最前卫的技术或创意去颠覆现状。", options: spectrumOptions('CRT', 'SP', 1.0) },
    { id: 9, type: 'spectrum', text: "我觉得严谨的流程和标准是成功的基石，任何跳出框架的行为都是风险。", options: spectrumOptions('EXC', 'CRT', 1.0) },
    { id: 10, type: 'spectrum', text: "我享受那种通过专业知识解决别人解决不了的难题后的那种纯粹快感。", options: spectrumOptions('SP', 'LD', 1.0) },
    { id: 11, type: 'spectrum', text: "我习惯于制定宏大的愿景，并享受说服他人加入我的事业的过程。", options: spectrumOptions('LD', 'EXC', 1.0) },
    { id: 12, type: 'spectrum', text: "在琐碎的数据分析中，我能发现潜在的商业模式和增长机会。", options: spectrumOptions('CRT', 'SP', 1.0) },
    { id: 13, type: 'spectrum', text: "我有一套极度高效的工作流，能确保在规定时间内保质保量完成任务。", options: spectrumOptions('EXC', 'LD', 1.0) },
    { id: 14, type: 'spectrum', text: "我希望我所负责的每一个模块都是行业内的标杆，没有瑕疵。", options: spectrumOptions('SP', 'CRT', 1.0) },
    { id: 15, type: 'spectrum', text: "我敢于在信息极不对称的情况下做出影响团队命运的关键决策。", options: spectrumOptions('LD', 'EXC', 1.0) },
    { id: 16, type: 'spectrum', text: "我是团队里那个最不服输的执行者，靠毅力和汗水拿结果。", options: spectrumOptions('EXC', 'SP', 1.0) }
  ],

  defaultResultId: 'Generalist',

  synergyRules: [
    {
      title: '高压决策者',
      reason: '你在面对复杂利益博弈时展现出了超越同龄人的冷峻与定力。这种“战略+执行”的双重驱动力，让你注定能成为团队中的压舱石。',
      trigger: [{ qId: 15, optIdx: [3, 4] }, { qId: 5, optIdx: [3, 4] }]
    },
    {
      title: '极客理想主义',
      reason: '你对技术的极致追求与对陈规的天然反叛，结合成了一种极其纯粹的创新力量。你不是在解决问题，而是在重新定义标准。',
      trigger: [{ qId: 6, optIdx: [3, 4] }, { qId: 8, optIdx: [3, 4] }]
    }
  ],

  dimensionPairs: [
    { key: 'CREXC', labelLeft: '高效执行', labelRight: '前沿创新', dimLeft: 'EXC', dimRight: 'CRT', colorLeft: 'bg-emerald-500', colorRight: 'bg-yellow-500' },
    { key: 'LDSP', labelLeft: '硬核专业', labelRight: '战略领袖', dimLeft: 'SP', dimRight: 'LD', colorLeft: 'bg-blue-500', colorRight: 'bg-red-500' },
  ],

  advantageLib: {
    'CRT': { icon: '✨', title: '创新引擎', desc: '擅长从废墟中建立新逻辑，存量竞争时代的战略资产。', shortage: '容易在落地细节上失去耐心，导致项目“虎头蛇尾”。' },
    'LD': { icon: '🎯', title: '战略统筹', desc: '总能看到棋局终极走势，做出最艰难的利益博弈。', shortage: '可能显得过于功利或缺乏温情，造成团队的人文情感流失。' },
    'EXC': { icon: '🔩', title: '极致颗粒度', desc: '对执行细节的追求，是愿景能实现“最后一公里”的保障。', shortage: '陷入细节后容易视线狭窄，无法感知行业大势的剧烈变化。' },
    'SP': { icon: '🏗️', title: '专业灯塔', desc: '标准定义者，无可替代的厚度是议价核心。', shortage: '存在一定的职业洁癖，对非专业因素干扰的容忍度极低。' },
  },

  results: [
    {
      id: 'Visionary', title: '愿景家',
      subtitle: '时代的开路人。',
      description: '你拥有极其敏锐的商业嗅觉和一种近乎狂热的信念感。只要你认准方向，全世界都会为你让路。你不仅仅是一个领导者，你是一个造梦者，能将虚无缥缈的念头转化为足以对抗平庸的宏大帝国。',
      condition: (s) => (s['CRT']||0) >= 3 && (s['LD']||0) >= 3
    },
    { id: 'Tech_Expert', title: '极客之魂', subtitle: '降临派专家。', description: '追求极致的专业和深度。能把一个细节磨到世界第一的人。你对这个世界的认知是基于最底层逻辑的，任何花哨的表象都无法欺骗你的鹰眼。', condition: (s) => (s['SP']||0) >= 3 && (s['EXC']||0) >= 3 },
    { id: 'Generalist', title: '平衡主义者', subtitle: '强大的通才。', description: '你各方面都表现得很稳面，不仅拥有可靠的执行力，更有不俗的统筹潜质。你是组织中最完美的平衡点，能自如地在不同的专业语境中穿梭切换。', condition: (s) => true }
  ],
  rarityData: { map: { 'Specialist': 25.4, 'Generalist': 32.1, 'Strategist': 18.2, 'Creative': 24.3, 'Visionary': 10.0, 'Tech_Expert': 15.0 } },
  valueProps: ["核心优势基因图谱", "市场溢价分析", "天花板预测"],
  analysisSteps: [{ text: "解析技能基因...", icon: "Briefcase" }, { text: "计算增长潜能...", icon: "Zap" }]
};

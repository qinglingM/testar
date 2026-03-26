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
  title: '职业优势分析',
  subtitle: '挖掘你的职场隐藏天赋，找到最适合你的位置',
  coverImage: careerCover,
  icon: careerIcon,
  questionsCount: 16,
  participantsCount: 62158,
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
      condition: (s) => (s['CRT']||0) >= 3 && (s['LD']||0) >= 3,
      behavioralAnalysis: "在深度行为范式分析中，你展现出一种‘极度稀缺’的战略感召力。通过对你 16 道核心维度题目的交叉比对，我们发现你在面对资源极度匮乏且信息不对称的极端环境时，拥有一种超乎常人的韧性。这种深度范式不仅仅是决策的简单迭代，更是你潜意识底层中对于‘世界规律’与‘自我意志’的极限对冲结果。当你处于心流状态时，你的认知资源会自动向你的‘未来观测’功能倾斜，从而在极短时间内完成从市场空白点捕捉到价值闭环构建的宏大路径。这种范式的高阶表现是能够将外部的混乱转化为内部的剧本，即便在泡沫破裂的寒冬，依然能够保持核心愿景的磁场，不被世俗的短利所诱导。你是规则的重塑者，也是行业的先行军。",
      potentialAnalysis: "关于未来的演化路径，你正站在一个全新的‘跨维度爆发点’。基于你的心理底色，你未来的突破口在于‘组织赋能’带来的系统性增长。你不再仅仅满足于在创意领域单兵作战，而是开始尝试调动那些极其精密的‘执行模块’。这种演化并非对你‘自由灵感’的束缚，而是一种更高层面的圆满。在接下来的五年到十年中，你将通过一系列具有行业震慑力的并购或深度整合，完成从‘灵感个体’到‘价值载体’的飞跃。你不仅能够管理好自己的思维宇宙，更能够成为整个产业生态的内核，驱动更宏大的商业版图。通过对碎片化机会的整合，你将逐渐掌握一种‘顺势而为的统治感’，在复杂的世界网络中，找到属于你自己的绝对中心位。"
    },
    { 
      id: 'Tech_Expert', title: '极客之魂', 
      subtitle: '降临派专家。', 
      description: '追求极致的专业和深度。能把一个细节磨到世界第一的人。你对这个世界的认知是基于最底层逻辑的，任何花哨的表象都无法欺骗你的鹰眼。', 
      condition: (s) => (s['SP']||0) >= (s['LD']||0) && (s['SP']||0) >= (s['CRT']||0),
      behavioralAnalysis: "在深度行为范式层面，你展现出一种‘真理洁癖’式的精密逻辑闭环。通过对你作答中关于技术打磨和规则边界的选择比对，我们发现你的大脑对‘不彻底的逻辑’有着生理性的排斥。你的沟通风格严谨、客观且带有一种基于专业厚度的权威感。这种范式让你在研发、复杂系统建模或需要绝对精准度的金融定价中具有降维打击的优势。你不需要通过社交技巧来获取认可，你的作品本身就是最高级的社交货币。然而，这种对‘绝对正確’的极致追求也会产生‘执行孤岛’的效应，在需要快速妥协或模糊预测的商业环境中，你可能由于无法获得百分之百的证据而陷入长时间的沉默。你是一个深潜者，只在最幽暗的逻辑深处捕捉那颗发光的真理珍珠。",
      potentialAnalysis: "在未来的潜能演化路径中，你正处于从‘硬核专家’向‘顶级技术布道者’或‘规则制定者’进阶的关键时刻。你目前的成功主要依赖于个体的专业精度，但这很快会触及‘时间算力极限’的红线。建议在未来的中长期规划中，有意识地引入‘逻辑导出系统’，将你的思维模型转化为可被普罗大众理解的价值协议，从而实现从‘解决问题’到‘定义问题’的范式降级。你未来的真正爆发点在于将你的‘专业灯塔’属性转化为一种‘行业共识’，不再是简单的技术实现者，而是底层逻辑的立法者。随着你对商业非线性反馈的理解加深，你将能够构建起一个具有社交溢价的高端智识圈层，实现从‘内卷深度’到‘扩展广度’的本质跨越。你不仅是知识的卫道士，更是未来的架构师。"
    },
    { 
      id: 'Generalist', title: '平衡主义者', 
      subtitle: '强大的通才。', 
      description: '你各方面都表现得很稳面，不仅拥有可靠的执行力，更有不俗的统筹潜质。你是组织中最完美的平衡点，能自如地在不同的专业语境中穿梭切换。', 
      condition: (s) => true,
      behavioralAnalysis: "你在深度行为范式中展现出一种‘全维度兼容’式的中道智慧。通过对你作答中关于多任务并排处理和跨部门协调选择的分析，我们发现你的行为动机高度依赖于‘局面的整体稳定度’。你的沟通风格灵活且具有极强的‘语境转换’能力，能有效翻译不同专业条线之间的信息断层。这种范式让你成为组织中不可或缺的‘最后一道润滑剂’。然而，这种全维度的平衡也会让你在需要‘单点极端爆破’的剧变时刻显得过于周全，产生‘多而不精’的认知假象。你是一个全能的棋手，你的力量不在于某一两个棋子的绝对优势，而在于你对整盘棋局走势的‘非对称性掌控’。你能在平庸中发现机会，在沸腾中预见危机。",
      potentialAnalysis: "关于未来的演化路径，你正处于从‘职场多面手’向‘顶级资源操盘人’转化的关键奇点。你目前的生态位依赖于极高的综合素质和对系统规则的熟练运用，但在面临‘垂直深度’的挑战时会显得力气稍有分散。建议在未来的进阶中，通过一系列具有标志性意义的跨界项目，有意识地训练‘单点溢价’的能力，在博大精深中保留一个绝对领先的‘杀手锏’，通过对局部优势的无限放大，为你的平衡力补齐缺失的‘攻击性硬件’。你未来的爆发点在于将你的‘链接天赋’升级为‘系统整合能力’，不再是简单的救火员，而是整套生态规则的编译器。随着你对深层博弈逻辑的理解加深，你将能够构建起一个具有高度粘性的中枢系统，实现从‘适应环境’到‘创造环境’的本质飞跃。你不仅是组织的定海神针，更是时代的导航员。"
    }
  ],
  rarityData: { map: { 'Specialist': 25.4, 'Generalist': 32.1, 'Strategist': 18.2, 'Creative': 24.3, 'Visionary': 10.0, 'Tech_Expert': 15.0 } },
  valueProps: ["核心优势基因图谱", "市场溢价分析", "天花板预测"],
  analysisSteps: [{ text: "解析技能基因...", icon: "Briefcase" }, { text: "计算增长潜能...", icon: "Zap" }]
};

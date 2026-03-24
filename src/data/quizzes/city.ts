import { QuizDefinition } from '../quiz-schema';
import cityCover from '@/assets/covers/mbti.png'; 

// Predefined spectrum options helper
const spectrumOptions = (posKey: string, negKey: string, weight: number = 1.0) => [
  { label: "非常不符合", scores: { [negKey]: 2 * weight } },
  { label: "不符合", scores: { [negKey]: 1 * weight } },
  { label: "一般", scores: {} },
  { label: "符合", scores: { [posKey]: 1 * weight } },
  { label: "非常符合", scores: { [posKey]: 2 * weight } },
];

export const cityQuiz: QuizDefinition = {
  id: 'city',
  title: '心灵归宿城市测试',
  subtitle: '在 30 座顶级宜居/旅居名城中，寻找你下半生的灵魂坐标',
  coverImage: cityCover,
  icon: 'Compass',
  questionsCount: 25,
  participantsCount: 158221,
  estimatedMinutes: 8,
  visualization: 'radar',
  
  reportConfig: {
    topCardType: 'rarity',
    advantageMode: 'both'
  },

  dimensions: [
    { key: 'MAT', label: '物质追求', colorClass: 'bg-emerald-500' }, 
    { key: 'SOC', label: '社交偏好', colorClass: 'bg-blue-500' },    
    { key: 'DES', label: '底层欲望', colorClass: 'bg-purple-500' },  
    { key: 'STG', label: '人生阶段', colorClass: 'bg-amber-500' },   
    { key: 'EMO', label: '情感归属', colorClass: 'bg-rose-500' },    
  ],

  questions: [
    { id: 1, type: 'spectrum', text: "比起深夜静谧的森林，我更迷恋霓虹闪烁的写字楼。", options: spectrumOptions('MAT', 'EMO', 1.0) },
    { id: 2, type: 'spectrum', text: "我宁愿在快节奏中内卷，也不愿在慢节奏中平庸。", options: spectrumOptions('STG', 'DES', 1.0) },
    { id: 3, type: 'spectrum', text: "我认为社交的质量取决于交换价值，而不是情感深度。", options: spectrumOptions('SOC', 'MAT', 1.0) },
    { id: 4, type: 'spectrum', text: "我追求一种绝对的离群索居，没有人认识我是最大的自由。", options: spectrumOptions('DES', 'SOC', 1.0) },
    { id: 5, type: 'spectrum', text: "如果生活太安稳，我会感到一种生命被凝固的焦虑。", options: spectrumOptions('MAT', 'STG', 1.0) },
    { id: 6, type: 'spectrum', text: "我非常在意城市的公共设施是否能支撑起精致的物质生活。", options: spectrumOptions('MAT', 'DES', 1.0) },
    { id: 7, type: 'spectrum', text: "我希望能在一个有着千年厚重历史的地方产生土地联结。", options: spectrumOptions('EMO', 'MAT', 1.0) },
    { id: 8, type: 'spectrum', text: "我目前的精力已无法支持从头再来的拼搏，我需要一份长久的安宁。", options: spectrumOptions('STG', 'MAT', 1.0) },
    { id: 9, type: 'spectrum', text: "我喜欢那种满街都是艺术、创意和不确定性的氛围。", options: spectrumOptions('SOC', 'STG', 1.0) },
    { id: 10, type: 'spectrum', text: "金钱在我的幸福指数中占比极高，我必须在风口城市。", options: spectrumOptions('MAT', 'EMO', 1.2) },
    { id: 11, type: 'spectrum', text: "比起昂贵的餐厅，我更喜欢在路边摊听老人讲古老的故事。", options: spectrumOptions('EMO', 'SOC', 1.0) },
    { id: 12, type: 'spectrum', text: "我不需要很多朋友，但我需要跟有趣的大脑身处同一个社区。", options: spectrumOptions('SOC', 'DES', 1.0) },
    { id: 13, type: 'spectrum', text: "我享受掌控权力和影响力的快感。", options: spectrumOptions('DES', 'STG', 1.0) },
    { id: 14, type: 'spectrum', text: "如果能换来内心的平和，我愿意放弃目前所有的晋升机会。", options: spectrumOptions('EMO', 'STG', 1.0) },
    { id: 15, type: 'spectrum', text: "我理想的一天从推开窗看到海或山开始，而不是听到闹钟。", options: spectrumOptions('DES', 'MAT', 1.0) },
    { id: 16, type: 'spectrum', text: "比起在摩天大楼里做螺丝钉，我更愿意在山野间做一名主理人。", options: spectrumOptions('DES', 'MAT', 1.2) },
    { id: 17, type: 'spectrum', text: "我无法忍受南方的潮湿，干燥爽朗的北方空气更有生命力。", options: spectrumOptions('EMO', 'SOC', 1.0) },
    { id: 18, type: 'spectrum', text: "城市的政治地位和对资源的顶级掌控力，是我选择定居的重要参考。", options: spectrumOptions('STG', 'DES', 1.3) },
    { id: 19, type: 'spectrum', text: "我理想的生活中必须要有一片海，哪怕只是每天看着它。", options: spectrumOptions('DES', 'EMO', 1.5) },
    { id: 20, type: 'spectrum', text: "我喜欢那种能听到地道方言、有着浓厚宗族或邻里感的熟人社区。", options: spectrumOptions('SOC', 'MAT', 1.1) },
    { id: 21, type: 'spectrum', text: "我希望我的邻友大部分是受过高等教育的精英，社交质量高于数量。", options: spectrumOptions('MAT', 'SOC', 1.2) },
    { id: 22, type: 'spectrum', text: "我不怕寒冷，我甚至喜欢四季更迭带来的那种仪式感与沉静。", options: spectrumOptions('EMO', 'STG', 1.0) },
    { id: 23, type: 'spectrum', text: "我愿意牺牲一定的物质便利，去换取灵魂上的『觉醒』或精神救赎。", options: spectrumOptions('DES', 'MAT', 1.5) },
    { id: 24, type: 'spectrum', text: "我迷恋那种老工业城市的残缺美，以及某种沉稳的老牌『体制内』安全感。", options: spectrumOptions('STG', 'SOC', 1.2) },
    { id: 25, type: 'spectrum', text: "我希望我的生活被高度智能化的基础设施包围，甚至买菜都能自动感应。", options: spectrumOptions('MAT', 'STG', 1.4) },
  ],

  results: [
    { 
      id: 'Chengdu', title: '成都\n烟火里的慢哲思', subtitle: '安逸与奋斗的量子叠加态。', 
      description: '成都不仅是一座城，更是一种对抗世界粗暴逻辑的温柔。你在这里能找到对“安逸”最高级的定义：在物质并不匮乏的基础上，保持对生活的热爱。',
      condition: (s) => (s['SOC']||0) > 4 && (s['EMO']||0) > 4 && (s['MAT']||0) < 12,
      behavioralAnalysis: "在高度竞争的环境下，你会表现出某种松弛感。你倾向于在关系中获取能量，并以此作为对抗外部压力的缓冲区。这种范式让你在成都这种高感性城市生存的核心机制。",
      potentialAnalysis: "未来 5-10 年，你最需要关注的是如何从『安逸的接收者』向『安稳的创造者』转型。",
      paidAnalysis: {
        coreDescription: "成都提供最高密度的烟火气反馈。",
        futurePath: "深挖生活方式相关的数字创意领域。",
        whySuits: "烟火气、中医药文化、青年亚文化。",
        notSuits: "如果你是极致的高效率追求者，这里的慢节奏会让你产生道德负罪感。",
        peers: "追求生活质量的高管、数字游民、感性艺术家。"
      }
    },
    { 
      id: 'shanghai',
      title: '魔都核心区\n极致精英的精密律动',
      subtitle: '全球视野下的能量巅峰。',
      description: "你是一个典型的能量驱动型人格，上海的快节奏与高精度正是你的养料。",
      condition: (scores) => (scores.MAT || 0) > 10,
      behavioralAnalysis: "在高度竞争的环境下，你会表现出极强的适应性与效率导向。你习惯于在多任务之间高速切换，并以此获得一种掌控感。",
      potentialAnalysis: "未来 5-10 年，你最需要关注的是如何从『效率机器』向『生态决策者』战略转型。",
      paidAnalysis: {
        coreDescription: "上海是你的能量锚点，提供最高密度的反馈。",
        whySuits: "高效、精准、国际化。",
        notSuits: "缺乏松弛感，情感溢价低。",
        futurePath: "深挖行业壁垒，建立生态防御。",
        peers: "高管、金融从业者、数字游民。"
      }
    }
  ],
  defaultResultId: 'Chengdu',
  reportTips: [
    "在生活压力增加时，尝试回忆在成都街头漫步时的『无意义感』，那能帮你重获韧性。",
    "将你的社交半径适度缩小，专注于高能量的深度联结，而非泛泛而谈。",
    "在追求物质确定性的同时，给灵魂留出至少 10% 的不确定空间。"
  ],
  relationshipAdvice: "你倾向于在深度链接中寻找安全感。建议在交往初期展示更多的边界感，这有助于建立更稳固的长久关系。",
  rarityData: { map: { 'Chengdu': 12.8, 'shanghai': 8.5 } },
  advantageLib: {
    'MAT': { icon: '💰', title: '物质掌控', desc: '在极高的经济流动性中，你能自如地调集资源。', shortage: '可能导致你在关系中表现得过于功利。' },
    'SOC': { icon: '🏮', title: '社会链接', desc: '在烟火气与熟人社会中，你能迅速建立信任。', shortage: '过多的无效社交可能会吞噬你的个人提升时间。' },
    'DES': { icon: '🦅', title: '底层自由', desc: '追求绝对的自我掌控，拒绝被系统异化。', shortage: '在需要团队协作的现代职场中可能表现得格格不入。' },
  },
  analysisSteps: [
    { text: "收集作答碎片...", icon: "Fingerprint" },
    { text: "比对城市基因...", icon: "Compass" },
    { text: "测算底层欲望...", icon: "Star" },
    { text: "匹配最终坐标...", icon: "Sparkle" }
  ]
};

import { QuizDefinition } from '../quiz-schema';
import enneagramCover from '@/assets/covers/enneagram.png';
import enneagramIcon from '@/assets/icons/enneagram.png';

const spectrumOptions = (posKey: string, negKey: string, weight = 1.0) => [
  { label: "强烈反对", scores: { [negKey]: 1 * weight } },
  { label: "反对", scores: { [negKey]: 0.5 * weight } },
  { label: "中立", scores: {} },
  { label: "同意", scores: { [posKey]: 0.5 * weight } },
  { label: "强烈同意", scores: { [posKey]: 1 * weight } },
];

export const enneagramQuiz: QuizDefinition = {
  id: 'enneagram',
  title: '九型人格性格探索',
  subtitle: '深入潜意识的核心，发现你的核心驱动力与恐惧',
  coverImage: enneagramCover,
  icon: enneagramIcon,
  questionsCount: 18,
  participantsCount: '5.3万',
  estimatedMinutes: 4,
  visualization: 'radar',
  
  reportConfig: {
    topCardType: 'rarity',
    advantageMode: 'both'
  },

  synergyRules: [
    {
      title: '高压下的执行者',
      reason: '当你原本内省的性格在面对挑战时，却爆发出了极其惊人的决策与行动力。这种“被唤醒的狮子”模式说明你的潜意识防御机制极其稳健且具有反击性。',
      trigger: [{ qId: 13, optIdx: [3, 4] }, { qId: 1, optIdx: [3, 4] }]
    },
    {
      title: '极致自律的孤独者',
      reason: '你对秩序的执着与对社交的疏离产生了一种“完美的隔离”。你不是不需要他人，而是你构建的高标准世界已经足够自给自足。',
      trigger: [{ qId: 6, optIdx: [3, 4] }, { qId: 17, optIdx: [3, 4] }]
    },
    {
      title: '情感导向的观察家',
      reason: '虽然你有着深刻的内省习惯，但你的每一次观察都是带着温度的。你不是通过逻辑去解读世界，而是通过灵魂的共振去感知规律。',
      trigger: [{ qId: 15, optIdx: [3, 4] }, { qId: 12, optIdx: [3, 4] }]
    }
  ],

  dimensions: [
    { key: 'ORD', label: '秩序性', colorClass: 'bg-amber-500' },
    { key: 'SOC', label: '社交感', colorClass: 'bg-purple-500' },
    { key: 'ACT', label: '行动力', colorClass: 'bg-orange-500' },
    { key: 'HRT', label: '情感力', colorClass: 'bg-rose-500' },
    { key: 'REF', label: '内省力', colorClass: 'bg-indigo-500' },
    { key: 'HEA', label: '理智感', colorClass: 'bg-blue-500' },
  ],

  questions: [
    { id: 1, type: 'spectrum', text: "比起思考“为什么”，我更倾向于直接动手去解决问题。", options: spectrumOptions('ACT', 'REF', 1.0) },
    { id: 2, type: 'spectrum', text: "我讨厌漫长的决策过程，宁愿在行动中修整错误。", options: spectrumOptions('ACT', 'REF', 1.0) },
    { id: 3, type: 'spectrum', text: "在遇到冲突时，我总是先保持客观冷静，分析对方的逻辑漏洞。", options: spectrumOptions('HEA', 'HRT', 1.0) },
    { id: 4, type: 'spectrum', text: "我非常看重专业知识与数据支持，而不是直觉或情感反馈。", options: spectrumOptions('HEA', 'HRT', 1.0) },
    { id: 5, type: 'spectrum', text: "如果事情没有按照预定的标准进行，我会感到非常不安甚至愤怒。", options: spectrumOptions('ORD', 'ACT', 1.0) },
    { id: 6, type: 'spectrum', text: "我拥有一套严苛的自我管理标准，并以此要求身边的人。", options: spectrumOptions('ORD', 'REF', 1.0) },
    { id: 7, type: 'spectrum', text: "我非常在意自己在群体中的形象，希望能得到大家的认可。", options: spectrumOptions('SOC', 'ORD', 1.0) },
    { id: 8, type: 'spectrum', text: "我喜欢与人建立深层的情感连接，孤单会让我感到焦虑。", options: spectrumOptions('SOC', 'HRT', 1.0) },
    { id: 9, type: 'spectrum', text: "我总是努力成为最优秀的那个人，成就感是我最大的驱动力。", options: spectrumOptions('ACT', 'SOC', 1.0) },
    { id: 10, type: 'spectrum', text: "我宁愿避开冲突，维持内心的平静比赢得争论更重要。", options: spectrumOptions('REF', 'ORD', 1.0) },
    { id: 11, type: 'spectrum', text: "我总是能发现事物的逻辑漏洞，并对此进行深入钻研。", options: spectrumOptions('HEA', 'REF', 1.0) },
    { id: 12, type: 'spectrum', text: "我觉得情感共鸣比单纯的逻辑论证更能说服我。", options: spectrumOptions('HRT', 'HEA', 1.0) },
    { id: 13, type: 'spectrum', text: "我习惯在深夜复盘自己一天的得失，这让我感到踏实。", options: spectrumOptions('REF', 'ACT', 1.0) },
    { id: 14, type: 'spectrum', text: "我希望我所处的每一个环境都是极其干净且有条不紊的。", options: spectrumOptions('ORD', 'ACT', 1.0) },
    { id: 15, type: 'spectrum', text: "当大家都在讨论时，我更喜欢在角落里观察每个人的微表情。", options: spectrumOptions('REF', 'SOC', 1.0) },
    { id: 16, type: 'spectrum', text: "如果能帮助我爱的人，我愿意做出巨大的自我牺牲。", options: spectrumOptions('HRT', 'SOC', 1.0) },
    { id: 17, type: 'spectrum', text: "我追求绝对的独立，讨厌任何形式的依赖或被干涉。", options: spectrumOptions('REF', 'SOC', 1.0) },
    { id: 18, type: 'spectrum', text: "我享受掌控大局的感觉，并且有信心带领大家走向成功。", options: spectrumOptions('ACT', 'ORD', 1.0) }
  ],

  defaultResultId: 'Type9',
  results: [
    { id: 'Type1', title: '1号 - 完美主义者 - 绝不妥协的灵魂', subtitle: '秩序捍卫者。', description: '你拥有极强的道德感和责任心。你不能容忍错误和混乱，总是在努力改进周围的一切。你的自律让人敬畏，但也容易让自己陷入过度的焦虑和挑剔中。你是一个致力于让世界运作得更加完美的秩序捍卫者，但请记住，接受不完美是通往内心宁静的唯一阶梯。', condition: (s) => (s['ORD']||0) >= 4 },
    { id: 'Type2', title: '2号 - 助人型 - 情感的粘合剂', subtitle: '温暖守望者。', description: '你渴望被需要，总是能精准地察觉到他人的需求并提供帮助。你善良、慷慨，是团队中的粘合剂。但请注意，在照顾别人的同时，不要忽略了自己内心深处那块需要被填补的空地。', condition: (s) => (s['HRT']||0) >= 3.5 && (s['SOC']||0) >= 3 },
    { id: 'Type3', title: '3号 - 成就型 - 闪耀的竞速者', subtitle: '闪耀奋斗者。', description: '你精力充沛，目标明确。在通往成功的道路上你不断奔跑，深谙如何在人群中脱颖而出。你重视效率和形象，追求极致成果。但也请偶尔停下来问问：褪去所有的光环，那个最真实的你是否依然觉得幸福？', condition: (s) => (s['ACT']||0) >= 5 },
    { id: 'Type4', title: '4号 - 自我型 - 孤独的造梦家', subtitle: '浪漫主义者。', description: '你拥有丰富的内心世界和敏锐的审美。你拒绝平庸，渴望真实地表达自我。你的情感深度无与伦比，但在孤独中寻找独特美感的同时，也要留神不要被忧郁的情绪漩涡吞噬。', condition: (s) => (s['HRT']||0) >= 4 && (s['REF']||0) >= 3 },
    { id: 'Type5', title: '5号 - 理智型 - 深度观察家', subtitle: '深度旁观者。', description: '你是一个天生的深度思考者。你喜欢独处，通过观察和学习来理解世界。你厌恶肤浅，尊重隐私和边界。作为一个在知识海洋中独自探索规律的旁观者，请尝试把你那足以改变局势的洞见分享给世界。', condition: (s) => (s['HEA']||0) >= 4 && (s['REF']||0) >= 3 },
    { id: 'Type6', title: '6号 - 忠诚型 - 安全的基石', subtitle: '安全守护者。', description: '你有着极强的风险意识，对团队和信念极度忠诚。你寻找安全感和归属感，未雨绸缪的谨慎让你非常可靠，但过度疑虑也会限制你的行动力。你是那个在任何危机时刻都能守住底线的人。', condition: (s) => (s['ORD']||0) >= 3 && (s['HEA']||0) >= 3 },
    { id: 'Type7', title: '7号 - 活跃型 - 快乐的追风人', subtitle: '快乐探索者。', description: '你讨厌束缚，大脑里装满了有趣的计划。你总是能看到事物积极的一面，永远在追逐新鲜感与快乐。你是大家的快乐源泉，但深度的挖掘和持久的专注，可能会带给你更深层的喜悦。', condition: (s) => (s['ACT']||0) >= 3 && (s['SOC']||0) >= 3 && (s['HRT']||0) >= 2 },
    { id: 'Type8', title: '8号 - 领袖型 - 果断的保护者', subtitle: '强大气场的捍卫者。', description: '你拥有强大的气场，敢于直面冲突，保护弱小。你追求自主和控制力，顶天立地且刚直果断。你的力量感让追随者感到安定，但也可能让身边的人感到压力。', condition: (s) => (s['ACT']||0) >= 5 && (s['ORD']||0) >= 3 },
    { id: 'Type9', title: '9号 - 和平型 - 人间治愈者', subtitle: '静谧的调解人。', description: '你擅长倾听和包容，接纳一切、化解纷争。你追求内心的平和，避免不必要的冲突。作为一个人间治愈者，请记住你的声音也很重要，不要因为过度的妥协而弄丢了真正的自己。', condition: (s) => true }
  ],
  rarityData: {
    description: "九型人格揭示了你防御机制背后的核心恐惧与动力，这在很大程度上决定了你的生命格局。",
    map: { 'Type1': 8.5, 'Type2': 11.2, 'Type3': 15.6, 'Type4': 4.2, 'Type5': 5.8, 'Type6': 22.1, 'Type7': 12.4, 'Type8': 6.9, 'Type9': 13.3 }
  },
  advantageLib: {
    'ACT': { icon: '⚡', title: '雷霆执行力', desc: '雷厉风行，将想法落地，不留死角。', shortage: '决策过快可能导致盲目，忽视潜在的系统性风险。' },
    'REF': { icon: '👁️', title: '深度洞察', desc: '透过现象看本质，锁定逻辑关键。', shortage: '容易陷入“思想上的巨人，行动上的矮子”的怪圈。' },
    'ORD': { icon: '📏', title: '极致规范', desc: '建立秩序，确保最高效的保障。', shortage: '古板、教条，对他人的变通行为缺乏基本的包容心。' },
    'HEA': { icon: '⚖️', title: '全维逻辑', desc: '剥离干扰，迅速锁定核心事实。', shortage: '过度依赖理性，在需要情感共鸣的场合表现得格格不入。' },
    'HRT': { icon: '❤️', title: '灵魂共鸣', desc: '天生的粘合剂，感知痛楚，链接他人。', shortage: '情感防御机制过重，容易因为他人的冷漠而备受打击。' },
    'SOC': { icon: '🤝', title: '群体引力', desc: '纽带作用，整合零散力量。', shortage: '过度依赖群体的反馈来锚定自我价值。' },
  },
  valueProps: ["核心动机拆解", "性格盲点定位", "成长路径指南"],
  analysisSteps: [{ text: "探测核心动机...", icon: "Compass" }, { text: "构建行为闭环...", icon: "Shield" }]
};

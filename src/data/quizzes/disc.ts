import { QuizDefinition } from '../quiz-schema';
import discCover from '@/assets/covers/disc.png';
import discIcon from '@/assets/icons/disc.png';

const choiceOptions = (scores: Record<string, number>) => [
  { label: "是的，这非常像我", scores: scores },
  { label: "不，这不是我", scores: {} }
];

export const discQuiz: QuizDefinition = {
  id: 'disc',
  title: 'DISC 行为风格分析',
  subtitle: '精准定位你的职场能量位阶与核心竞争力',
  coverImage: discCover,
  icon: discIcon,
  questionsCount: 10,
  participantsCount: '4.1万',
  estimatedMinutes: 2,
  visualization: 'spectrum',
  
  dimensionPairs: [
    { 
      key: 'ds', labelLeft: '稳健型 (S)', labelRight: '支配型 (D)', 
      dimLeft: 'S', dimRight: 'D', 
      colorLeft: 'bg-emerald-500', colorRight: 'bg-red-500' 
    },
    { 
      key: 'ic', labelLeft: '谨慎型 (C)', labelRight: '影响型 (I)', 
      dimLeft: 'C', dimRight: 'I', 
      colorLeft: 'bg-blue-500', colorRight: 'bg-amber-500' 
    },
  ],

  reportConfig: {
    topCardType: 'rarity',
    advantageMode: 'both'
  },

  synergyRules: [
    {
      title: '高压执行者 (D+C)',
      reason: '你不仅仅有强悍的决策力，更有着对手不可企及的逻辑严密度。你像一架精密的割草机，不仅速度快，而且修剪得极其平整重。',
      trigger: [{ qId: 1, optIdx: [0] }, { qId: 7, optIdx: [0] }]
    },
    {
      title: '温暖的粘合剂 (I+S)',
      reason: '你擅长用你的热情包裹住团队的每一个裂缝。在你的磁场中，人们不仅感到兴奋，更感到一种前所未有的安全感。',
      trigger: [{ qId: 3, optIdx: [0] }, { qId: 5, optIdx: [0] }]
    }
  ],

  dimensions: [
    { key: 'D', label: '支配力 (D)', colorClass: 'bg-red-500' },
    { key: 'I', label: '影响力 (I)', colorClass: 'bg-amber-500' },
    { key: 'S', label: '稳定性 (S)', colorClass: 'bg-emerald-500' },
    { key: 'C', label: '谨慎性 (C)', colorClass: 'bg-blue-500' },
  ],

  questions: [
    { id: 1, type: 'choice', text: "我是一个目标导向的人，习惯于直接下达指令以提高团队效率。", options: choiceOptions({ D: 3 }) },
    { id: 2, type: 'choice', text: "在遇到冲突时，我倾向于直接面对并迅速解决，而不是避重就轻。", options: choiceOptions({ D: 2 }) },
    { id: 3, type: 'choice', text: "在社交场合，我习惯于主动寻找话题，并享受成为众人关注焦点的感觉。", options: choiceOptions({ I: 3 }) },
    { id: 4, type: 'choice', text: "我擅长用热情的言语激励他人，即便是在士气低落的情况下。", options: choiceOptions({ I: 2 }) },
    { id: 5, type: 'choice', text: "我非常看重团队的和谐与稳定，宁愿牺牲一部分效率来维持人际关系。", options: choiceOptions({ S: 3 }) },
    { id: 6, type: 'choice', text: "我习惯于按部就班地处理工作，对于突如其来的变化会感到不安。", options: choiceOptions({ S: 2 }) },
    { id: 7, type: 'choice', text: "在做决策之前，我必须看到详细的数据支持和逻辑推导，不相信直觉。", options: choiceOptions({ C: 3 }) },
    { id: 8, type: 'choice', text: "我是一个完美主义者，无法忍受工作中出现任何细微的错误或遗漏。", options: choiceOptions({ C: 2 }) },
    { id: 9, type: 'choice', text: "我更喜欢独立完成任务，因为这样我能完全控制工作的质量与进度。", options: choiceOptions({ D: 1, C: 1 }) },
    { id: 10, type: 'choice', text: "我愿意花费大量时间倾听同事的诉求，并提供力所能及的帮助。", options: choiceOptions({ S: 2, I: 1 }) }
  ],

  defaultResultId: 'High_D',
  results: [
    { 
      id: 'High_D', title: 'D型 - 钢铁指挥官', 
      subtitle: '目标感极强的职场推土机。', 
      description: '你是天生的开拓者与终结者。在别人犹豫不决时，你已经率先扣动了扳机。你讨厌平庸，蔑视借口，在极致的压力面前你反而能爆发最强的指挥本能。你是那种能把0变成1，并让1以十倍速增长的引擎。请偶尔给团队一些喘息的空间，因为不是每个人都拥有和你一样永不枯竭的意志燃料。', 
      condition: (s) => (s['D']||0) >= (s['I']||0) && (s['D']||0) >= (s['S']||0)
    },
    { id: 'High_I', title: 'I型 - 灵魂感召者', subtitle: '极具感染力的职场润滑剂。', description: '哪里有你，哪里就有欢笑与希望。你拥有点石成金的说服力，能轻而易举地将原本枯燥的任务包装成一场伟大的冒险。你是团队的粘合剂，也是梦想的推销员。但请记得：在大声歌唱的同时，也要留神脚下的陷阱和那些极其细微的数据裂缝。', condition: (s) => (s['I']||0) >= (s['S']||0) && (s['I']||0) >= (s['C']||0) },
    { id: 'High_S', title: 'S型 - 职场定海神针', subtitle: '极其稳健的情感避风港。', description: '你是那种能让人感到极度安心的存在。你讨厌无意义的变革，守护着团队的节奏感与契约精神。你是一个极其优秀的倾听者，也是最可靠的长期执行者。在这个浮躁的时代，你稳定的情绪输出就是组织最宝贵的无形资产。', condition: (s) => (s['S']||0) >= (s['D']||0) && (s['S']||0) >= (s['C']||0) },
    { id: 'High_C', title: 'C型 - 逻辑纠错官', subtitle: '追求极致真相的精密仪。', description: '在你的世界里，精准就是正义。你对数据有着宗教般的虔诚，对逻辑漏洞有着鹰眼般的识别力。你是组织中最客观的决策大脑，能帮团队避开所有自以为是的陷阱。请尝试适度降低对他人的要求，因为世界并不总是一道逻辑自洽的数学题。', condition: (s) => true }
  ],
  rarityData: { map: { 'High_D': 15.2, 'High_I': 22.8, 'High_S': 38.5, 'High_C': 23.5 } },
  advantageLib: {
    'D': { icon: '🦁', title: '决断力', desc: '天生的开拓者，在迷雾中敢于率先做出决定。', shortage: '有时表现得过于强势，可能在无意中伤害团队成员的积极性。' },
    'I': { icon: '🎤', title: '感召力', desc: '热情和远见能瞬间凝聚人心，让团队燃起斗志。', shortage: '对细节关注不足，容易在具体的执行落地阶段产生偏差。' },
    'S': { icon: '⏳', title: '磐石耐力', desc: '始终是团队最稳的压舱石，保持心态恒定。', shortage: '对变革反应较慢，可能在快速迭代的市场环境中错失良机。' },
    'C': { icon: '🔍', title: '微米准度', desc: '对逻辑漏洞有着鹰眼般的识别力。', shortage: '容易陷入“过度分析”的泥潭，导致决策速度无法匹配业务需求。' },
  },
  valueProps: ["职场核心竞争力定位", "团队协作生态位建议"],
  analysisSteps: [{ text: "拆解行为倾向...", icon: "Briefcase" }, { text: "计算特质比重...", icon: "Zap" }]
};

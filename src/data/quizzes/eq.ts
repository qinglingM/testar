import { QuizDefinition } from '../quiz-schema';
import eqCover from '@/assets/covers/eq.png';
import eqIcon from '@/assets/icons/eq.png';

const spectrumOptions = (posKey: string, negKey: string, weight = 1.0) => [
  { label: "完全不是我", scores: { [negKey]: 2 * weight } },
  { label: "偶尔是", scores: { [negKey]: 1 * weight } },
  { label: "中立", scores: {} },
  { label: "比较符合", scores: { [posKey]: 1 * weight } },
  { label: "完全符合", scores: { [posKey]: 2 * weight } },
];

export const eqQuiz: QuizDefinition = {
  id: 'eq',
  title: '情商指数测评',
  subtitle: '掌控情绪也是一种超能力，看你的社交智慧与自控力',
  coverImage: eqCover,
  icon: eqIcon,
  questionsCount: 20,
  participantsCount: 91043,
  estimatedMinutes: 5,
  visualization: 'radar',
  
  reportConfig: {
    topCardType: 'rarity',
    advantageMode: 'both'
  },

  dimensions: [
    { key: 'AWR', label: '情绪察觉', colorClass: 'bg-purple-500' },
    { key: 'CTL', label: '自我激励', colorClass: 'bg-blue-500' },
    { key: 'EMP', label: '共情深度', colorClass: 'bg-rose-500' },
    { key: 'INT', label: '社交智慧', colorClass: 'bg-amber-500' },
    { key: 'RES', label: '心理韧性', colorClass: 'bg-emerald-500' },
  ],

  questions: [
    { id: 1, type: 'spectrum', text: "在生气的时候，我能立即意识到“我正在生气”，而不是直接顺着脾气开火。", options: spectrumOptions('AWR', 'CTL', 1.0) },
    { id: 2, type: 'spectrum', text: "即便面对压力极大的场合，我也能迅速冷静下来，思考下一步的对策。", options: spectrumOptions('CTL', 'AWR', 1.0) },
    { id: 3, type: 'spectrum', text: "我能轻易看透别人社交面具下的真实情绪，即便他们表现得很得体。", options: spectrumOptions('AWR', 'EMP', 1.0) },
    { id: 4, type: 'spectrum', text: "如果身边有人感到尴尬，我会比他本人还难受，并下意识尝试帮他解围。", options: spectrumOptions('EMP', 'INT', 1.0) },
    { id: 5, type: 'spectrum', text: "比起讨好所有人，我更倾向于直接表达事实，无论是否会让对方难堪。", options: spectrumOptions('INT', 'EMP', 1.0) },
    { id: 6, type: 'spectrum', text: "当事情未能如愿时，我能很快从挫败感中走出来，寻找新的机会。", options: spectrumOptions('RES', 'CTL', 1.0) },
    { id: 7, type: 'spectrum', text: "我擅长在团队中调节气氛，让原本僵硬的关系变得缓和。", options: spectrumOptions('INT', 'AWR', 1.0) },
    { id: 8, type: 'spectrum', text: "我非常清楚自己的优缺点，并能根据实际情况调整预期的目标。", options: spectrumOptions('AWR', 'RES', 1.0) },
    { id: 9, type: 'spectrum', text: "在长期的艰苦任务中，我能持续保持热情，不需要外界不断的监管。", options: spectrumOptions('CTL', 'RES', 1.0) },
    { id: 10, type: 'spectrum', text: "面对他人的批评，我能客观地分析其中的价值，而不是感到被冒犯。", options: spectrumOptions('RES', 'INT', 1.0) },
    { id: 11, type: 'spectrum', text: "我能感知到一屋子人中谁和谁的关系正在微妙地发生变化。", options: spectrumOptions('AWR', 'EMP', 1.0) },
    { id: 12, type: 'spectrum', text: "我经常主动承担协调者的角色，平衡各方的诉求。", options: spectrumOptions('INT', 'CTL', 1.0) },
    { id: 13, type: 'spectrum', text: "当我感到沮丧时，我有自己一套有效的解压方式，不会让它影响到他人。", options: spectrumOptions('CTL', 'AWR', 1.0) },
    { id: 14, type: 'spectrum', text: "我总是能给周围的人带去情绪价值，大家愿意听我的意见。", options: spectrumOptions('INT', 'EMP', 1.0) },
    { id: 15, type: 'spectrum', text: "对于突发事故，我很少陷入惊慌失措的状态。", options: spectrumOptions('RES', 'AWR', 1.0) },
    { id: 16, type: 'spectrum', text: "我能很敏感地察觉到伴侣或朋友还没说出口的不满。", options: spectrumOptions('EMP', 'AWR', 1.0) },
    { id: 17, type: 'spectrum', text: "我坚信只要坚持努力，目前的困境终将成为成长的养料。", options: spectrumOptions('RES', 'CTL', 1.0) },
    { id: 18, type: 'spectrum', text: "在各种复杂的社交场合，我总能找到自己最舒适的定位。", options: spectrumOptions('INT', 'RES', 1.0) },
    { id: 19, type: 'spectrum', text: "我能从他人的痛苦中感受到强烈的触动，甚至影响到自己。", options: spectrumOptions('EMP', 'RES', 1.0) },
    { id: 20, type: 'spectrum', text: "我对自己的未来有清晰的愿景，并且每一天都在为此积蓄力量。", options: spectrumOptions('CTL', 'RES', 1.0) }
  ],

  defaultResultId: 'Balanced',
  
  synergyRules: [
    {
      title: '高自知力觉察者',
      reason: '你在情绪爆发的临界点展现了极其罕见的“自我跳脱”观察能力，同时又能敏锐捕捉他人的微小情绪。这种“内照外感”的双重天赋说明你的 EQ 已进入大师级领域。',
      trigger: [{ qId: 1, optIdx: [3, 4] }, { qId: 3, optIdx: [3, 4] }]
    },
    {
      title: '冷峻的心理屏障',
      reason: '即便你拥有很强的逻辑分析力，在面对极端负面环境时，你展现出了近乎“无损”的心理韧性。你不是冷血，而是构建了一套极其高效的情绪免疫系统。',
      trigger: [{ qId: 15, optIdx: [3, 4] }, { qId: 10, optIdx: [3, 4] }]
    },
    {
      title: '社交润滑的代价',
      reason: '你在追求集体和谐与自我激励之间存在一种微妙的张力。你习惯于透支自己的“共情能量”去填补他人的情绪黑洞，这让你在社交中极受欢迎但也面临巨大的心理损耗。',
      trigger: [{ qId: 7, optIdx: [3, 4] }, { qId: 5, optIdx: [0, 1] }]
    }
  ],

  results: [
    {
      id: 'High_EQ', title: '高情商领袖 - 灵魂捕手',
      subtitle: '拥有极其敏锐的情感嗅觉，能优雅处理一切复杂社交局。',
      description: '你不仅懂自己，更懂众生。你总能成为话题的掌控者和情绪的出口。你的灵魂底层逻辑是基于“共识”的重构：你不仅能准确识别每一次微妙的情绪波段，更能在无声处平地起惊雷，通过情绪的降维打击平衡各方利益。你是那种即便身处冰冷的算法世界，也能靠温度和共振构建起最后一道人性护城河的顶级领袖。',
      condition: (s) => (s['AWR']||0) >= 3 && (s['EMP']||0) >= 3 && (s['INT']||0) >= 3
    },
    { id: 'Empathetic', title: '共情型共创者', subtitle: '极致温柔的灵魂。', description: '你是一个极其温柔的灵魂，能感知到每一个细微的情感波动。你习惯于用直觉代替算法去阅读这个世界。你的存在本身就是对周围人的一种“静音式治愈”，但请务必记住：在温暖别人的时候，不要忘了留一点火种照亮自己的归途。', condition: (s) => (s['EMP']||0) >= 4 },
    { id: 'Balanced', title: '情绪定海神针 - 稳健性人格', subtitle: '极佳的心理弹性，不卑不亢的处世大师。', description: '你很少被情绪带偏。你能接纳他人的不完美，也能守住自己的底线。这种生命的高度自洽，源于你内在的一套极其完善的情绪闭环逻辑。你既是参与者也是观察者，凡事留有余地，是真正意义上的“人间清醒”。', condition: (s) => true }
  ],
  advantageLib: {
    'EMP': { icon: '🌊', title: '深度共振', desc: '瞬间读懂他人沉默的能力，让你不可替代。', shortage: '极易被他人的负面情绪二次传染，造成自身心理过载。' },
    'AWR': { icon: '🧠', title: '情绪觉察', desc: '对自我情绪有着显微镜般的洞察，从不被奴役。', shortage: '可能陷入过度自我分析的泥潭，在行为上表现得犹豫。' },
    'CTL': { icon: '🏗️', title: '内核稳定', desc: '外界纷纷扰扰惊不起半点涟漪，是自己的主心骨。', shortage: '给人以冷漠、固执、难以亲近的距离感。' },
    'INT': { icon: '🎮', title: '社交大师', desc: '在复杂的利益交织中，通过情商博弈找到最优解。', shortage: '过度依赖社交技巧，可能丧失表达最真实直觉的能力。' },
    'RES': { icon: '🛡️', title: '韧性之盾', desc: '压力下展现出的极强生命力，是长期主义者的标志。', shortage: '习惯性独自扛下所有压力，直到崩溃的临界点。' },
  }
};

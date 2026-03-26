import { QuizDefinition } from '../quiz-schema';
import loveCover from '@/assets/covers/love.png';
import loveIcon from '@/assets/icons/love.png';

const spectrumOptions = (posKey: string, negKey: string, weight = 1.0) => [
  { label: "强烈反对", scores: { [negKey]: 2 * weight } },
  { label: "反对", scores: { [negKey]: 1 * weight } },
  { label: "中立", scores: {} },
  { label: "同意", scores: { [posKey]: 1 * weight } },
  { label: "强烈同意", scores: { [posKey]: 2 * weight } },
];

export const attachmentQuiz: QuizDefinition = {
  id: 'love',
  title: '恋爱依恋模式测评',
  subtitle: '你是深情海王，还是焦虑小狗？',
  coverImage: loveCover,
  icon: loveIcon,
  questionsCount: 12,
  participantsCount: 87412,
  estimatedMinutes: 3,
  visualization: 'radar',
  
  reportConfig: {
    topCardType: 'population',
    advantageMode: 'both'
  },

  dimensions: [
    { key: 'SEC', label: '安全感', colorClass: 'bg-emerald-500' },
    { key: 'ANX', label: '焦虑度', colorClass: 'bg-rose-500' },
    { key: 'AVO', label: '回避度', colorClass: 'bg-blue-500' },
    { key: 'COM', label: '沟通力', colorClass: 'bg-amber-500' },
  ],

  questions: [
    { id: 1, type: 'spectrum', text: "当伴侣没有及时回我消息时，我总是忍不住猜测对方是否已经在厌倦我。", options: spectrumOptions('ANX', 'SEC', 1.0) },
    { id: 2, type: 'spectrum', text: "我经常需要向伴侣确认“你还爱我吗”，否则内心会非常烦躁。", options: spectrumOptions('ANX', 'SEC', 1.0) },
    { id: 3, type: 'spectrum', text: "当对方试图跟我讨论深层次的情感话题时，我会下意识地想要叉开话题。", options: spectrumOptions('AVO', 'SEC', 1.0) },
    { id: 4, type: 'spectrum', text: "我非常看重独立空间，一旦对方靠得太近，我会感到压抑和窒息。", options: spectrumOptions('AVO', 'SEC', 1.0) },
    { id: 5, type: 'spectrum', text: "我相信任何矛盾都能通过坦诚的沟通解决，即使这会引发暂时的争吵。", options: spectrumOptions('COM', 'AVO', 1.0) },
    { id: 6, type: 'spectrum', text: "我愿意展示自己脆弱的一面给伴侣看，并不觉得这是一种软弱。", options: spectrumOptions('COM', 'AVO', 1.0) },
    { id: 7, type: 'spectrum', text: "如果一段关系让我感到太累或被束缚，我会迅速产生想要逃离的念头。", options: spectrumOptions('AVO', 'SEC', 1.0) },
    { id: 8, type: 'spectrum', text: "我经常担心伴侣并不是真心喜欢现在的我，所以努力表现得更完美。", options: spectrumOptions('ANX', 'SEC', 1.0) },
    { id: 9, type: 'spectrum', text: "对我来说，依赖他人是非常不安全的，凡事只能靠自己。", options: spectrumOptions('AVO', 'SEC', 1.0) },
    { id: 10, type: 'spectrum', text: "我能很敏锐地感知到伴侣情绪的微小起伏，并试图去安抚对方。", options: spectrumOptions('SEC', 'ANX', 1.0) },
    { id: 11, type: 'spectrum', text: "无论发生什么，我都有信心和对方一起面对生活中的困难。", options: spectrumOptions('SEC', 'ANX', 1.0) },
    { id: 12, type: 'spectrum', text: "我习惯于在争吵后先冷静下来，然后再寻找平衡点进行沟通。", options: spectrumOptions('COM', 'ANX', 1.0) }
  ],

  defaultResultId: 'Secure',

  synergyRules: [
    {
      title: '防御型共情者',
      reason: '你拥有极强的情绪感知力，但有趣的是，你倾向于利用这种感知力来为自己构建“撤退路线”。你在观察对方的同时，也在计算安全距离。',
      trigger: [{ qId: 10, optIdx: [3, 4] }, { qId: 4, optIdx: [3, 4] }]
    },
    {
      title: '高自律的爱徒',
      reason: '你在感情中表现出的理智与对规则的尊重，让你即便在剧烈的冲突中也能保持极高的沟通质量。这种“先治愈再讨论”的模式非常罕见。',
      trigger: [{ qId: 12, optIdx: [3, 4] }, { qId: 6, optIdx: [3, 4] }]
    }
  ],

  advantageLib: {
    'SEC': { icon: '🛡️', title: '情感弹性', desc: '能自如地应对亲密与距离，这种平衡感是健康的基石。', shortage: '由于过于追求和谐，有时会为了维护稳定而压抑自己最真实的负面爆发。' },
    'COM': { icon: '💬', title: '坦诚勇气', desc: '敢于展示脆弱，真实的表达能瞬间拉近心的距离。', shortage: '过度依赖沟通，当遇到拒绝沟通的伴侣时，会产生毁灭性的绝望感。' },
    'ANX': { icon: '🌈', title: '共鸣雷达', desc: '对情感微小流动的敏锐捕捉，让你能抢在危机前修复。', shortage: '过度解读。经常将中性行为误判为负面信号，导致关系由于过敏而受损。' },
    'AVO': { icon: '🏔️', title: '独立风骨', desc: '强大的自我世界，即便关系缺位时也能保持完整。', shortage: '在建立深层链接时存在天然屏障，难以与伴侣达成真正的灵魂共振。' },
  },

  results: [
    {
      id: 'Secure', title: '安全型依恋 - 灵魂定标器',
      subtitle: '拥有极其罕见的心理成熟度。',
      description: '你是一个极其自洽的个体。在亲密关系中，你既不担心被抛弃，也不害怕过度亲密。你深知“自我”与“他者”的界限，并能在这种界限中优雅地跳舞。你的存在，能让任何动荡的关系都趋于一种动态的平衡。你不需要靠控制或回避来获得安全感，因为你的内心本身就有一座坚不可摧的灯塔。',
      condition: (s) => (s['SEC']||0) >= 3.5
    },
    { id: 'Anxious', title: '焦虑型依恋 - 痴情追逐者', subtitle: '在爱中寻找回响的灵魂。', description: '你对爱有着近似宗教般的虔诚与渴望。你极其敏锐，甚至能感知到对方心跳的每一个微小变化。但请记住：你的价值不取决于对方的回信频率。学会为自己构建一个独立的内容宇宙，当你停止追逐风，风自然会为你停驻。', condition: (s) => (s['ANX']||0) >= (s['AVO']||0) && (s['ANX']||0) >= 3 },
    { id: 'Avoidant', title: '回避型依恋 - 孤独守望者', subtitle: '将自由视作唯一铠甲。', description: '亲密对你来说伴随着危险的信号。你习惯于在灵魂周围修筑高墙，以此保护那个独立却也略显干涸的自我。自由固然可贵，但在绝对的隔离中，生命也容易丧失色彩。试着给城墙开一扇窗，最初射进来的阳光可能有些刺眼，但那是生命复苏的信号。', condition: (s) => (s['AVO']||0) > (s['ANX']||0) && (s['AVO']||0) >= 3 },
    { id: 'Fearful', title: '恐惧型依恋 - 矛盾徘徊者', subtitle: '陷入“爱与怕”的循环。', description: '你是一个在冰与火之间挣扎的矛盾体。你渴望链接，又由于深度的恐惧而本能地撤退。这种早年的情感创伤让你在关系中始终处于“战斗或逃跑”的警报状态。治愈的第一步是接纳这种不安全感，并告诉那个受过伤的孩子：你已经长大了，你现在有力气去爱，也有能力去承受失去。', condition: (s) => (s['ANX']||0) >= 2.5 && (s['AVO']||0) >= 2.5 }
  ],
  rarityData: { map: { 'Secure': 55.2, 'Anxious': 19.8, 'Avoidant': 18.5, 'Fearful': 6.5 } },
  valueProps: ["依恋类型深度解剖", "防御机制识别", "安全型关系建议"],
  analysisSteps: [{ text: "分析情感反馈...", icon: "HeartPulse" }, { text: "还原依恋底色...", icon: "UserCircle" }]
};

import { QuizDefinition } from '../quiz-schema';
import cityCover from '@/assets/covers/mbti.png'; 

export const cityQuiz: QuizDefinition = {
  id: 'city',
  title: '心灵归宿城市测试',
  subtitle: '在 30 座顶级宜居/旅居名城中，寻找你下半生的灵魂坐标',
  coverImage: cityCover,
  icon: 'Compass',
  questionsCount: 25,
  participantsCount: 158221,
  estimatedMinutes: 8,
  dimensions: [
    { key: 'energy', label: '城市能量位阶' },
    { key: 'comfort', label: '宜居舒适度' },
    { key: 'culture', label: '人文包容性' },
    { key: 'opportunity', label: '职业溢价力' }
  ],
  questions: [
    {
      id: 1,
      text: "当你在一个完全陌生的城市醒来，清晨的第一种感觉通常是？",
      options: [
        { label: "兴奋，迫不及待想要探索未知的街道", scores: { energy: 2, culture: 1 } },
        { label: "平静，更关心能否找到一杯合口味的咖啡", scores: { comfort: 2 } },
        { label: "略显局促，开始下意识寻找熟悉的地标", scores: { comfort: 1 } },
        { label: "直接进入状态，开始查阅当地的行业动态", scores: { opportunity: 2, energy: 1 } }
      ]
    }
  ],
  results: [
    {
      id: "shanghai",
      title: "魔都核心区：精致利己与全球视野的交汇点",
      subtitle: "魔都核心区域",
      description: "你是一个典型的能量驱动型人格，上海的快节奏与高精度正是你的养料。",
      condition: (scores) => (scores.energy || 0) > 10,
      behavioralAnalysis: "在高度竞争的环境下，你会表现出极强的适应性与效率导向。你习惯于在多任务之间高速切换，并以此获得一种掌控感。这种范式让你在都市生态中如鱼得水，但也可能导致你长期处于神经紧绷状态。你倾向于通过消费与社交反馈来确认自我价值，这种外向型确认是你在上海这种高维城市生存的核心机制。",
      potentialAnalysis: "未来 5-10 年，你最需要关注的是如何从‘效率机器’向‘生态决策者’转型。在上海这种资源极度密集的地区，单纯的勤奋已无法带来阶层跃迁。建议你利用当前的人脉红利，深挖 1-2 个细分领域的底层逻辑，建立属于自己的防御壁垒。同时，适当引入‘反效率’的冥想或非营利性社交，能有效防止精神崩盘，提升你的长期韧性。",
      paidAnalysis: {
        coreDescription: "上海是你的能量锚点，这里提供最高密度的反馈。",
        whySuits: "高效、精准、国际化。",
        notSuits: "缺乏松弛感，情感溢价低。",
        futurePath: "深挖行业壁垒，建立生态防御。",
        peers: "高管、金融从业者、数字游民。"
      }
    }
  ],
  defaultResultId: "shanghai",
  valueProps: [
    "解析你与城市生命力的深层共振",
    "发现最适合你下半生职业跃迁的坐标",
    "获取该城市专属的‘生存质量避坑指南’"
  ]
};

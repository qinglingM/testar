import { QuizDefinition } from "../quiz-schema";

export const mbtiQuiz: QuizDefinition = {
  id: 'mbti',
  title: 'MBTI 灵魂探测仪',
  subtitle: '16型人格专业版，探索你的思维底色。',
  icon: 'https://cdn-icons-png.flaticon.com/512/3079/3079204.png',
  coverImage: 'https://images.unsplash.com/photo-1518331647614-7a1f04cd34cf?q=80&w=800&auto=format&fit=crop',
  questionsCount: 16,
  participantsCount: 248692,
  estimatedMinutes: 5,
  dimensions: [
    { key: 'E', label: '外向 (Extraversion)', colorClass: 'bg-orange-500' },
    { key: 'I', label: '内向 (Introversion)', colorClass: 'bg-indigo-500' },
    { key: 'N', label: '直觉 (Intuition)', colorClass: 'bg-purple-500' },
    { key: 'S', label: '实感 (Sensing)', colorClass: 'bg-emerald-500' },
    { key: 'T', label: '逻辑 (Thinking)', colorClass: 'bg-blue-500' },
    { key: 'F', label: '情感 (Feeling)', colorClass: 'bg-rose-500' },
    { key: 'J', label: '计划 (Judging)', colorClass: 'bg-amber-500' },
    { key: 'P', label: '灵活 (Perceiving)', colorClass: 'bg-cyan-500' },
  ],
  questions: [
    {
      id: 1, text: "在周五晚上，你更倾向于：",
      options: [
        { label: "和一群朋友去派对或聚会", scores: { E: 10 } },
        { label: "独自在家看书或看电影", scores: { I: 10 } }
      ]
    },
    {
      id: 2, text: "当你在思考未来时，你更多：",
      options: [
        { label: "关注大的蓝图和各种可能性", scores: { N: 10 } },
        { label: "关注具体的计划和现实的步骤", scores: { S: 10 } }
      ]
    },
    {
      id: 3, text: "在做决策时，你更看重：",
      options: [
        { label: "客观的逻辑和事实分析", scores: { T: 10 } },
        { label: "他人的感受和对关系的影响", scores: { F: 10 } }
      ]
    },
    {
      id: 4, text: "你的工作台通常看起来：",
      options: [
        { label: "整洁有序，所有东西各就其位", scores: { J: 10 } },
        { label: "凌乱但富有创意，随性而发", scores: { P: 10 } }
      ]
    },
    // ... Simplified mock for other 12 q
    { id: 5, text: "当你的手机响起时：", options: [{ label: "期待是谁打来的", scores: { E: 10 } }, { label: "希望不要是推销或麻烦", scores: { I: 10 } }] },
    { id: 6, text: "你对抽象概念的看法：", options: [{ label: "它是探索世界的钥匙", scores: { N: 10 } }, { label: "它往往不如具体实物可靠", scores: { S: 10 } }] },
    { id: 7, text: "朋友遇到困难向你倾诉，你首选：", options: [{ label: "帮TA分析逻辑并给出对策", scores: { T: 10 } }, { label: "给TA一个拥抱并分担情绪", scores: { F: 10 } }] },
    { id: 8, text: "出门旅行前：", options: [{ label: "我会列出精准到小时的清单", scores: { J: 10 } }, { label: "我只订个机票，具体看心情", scores: { P: 10 } }] },
    { id: 9, text: "在会议中，你通常：", options: [{ label: "率先发言并引导讨论", scores: { E: 10 } }, { label: "先听取意见后再进行总结", scores: { I: 10 } }] },
    { id: 10, text: "你比较相信：", options: [{ label: "第一直觉和灵感", scores: { N: 10 } }, { label: "过往的经验和数据", scores: { S: 10 } }] },
    { id: 11, text: "评价一个人，你会看：", options: [{ label: "TA的智商和工作能力", scores: { T: 10 } }, { label: "TA的人格魅力和善良度", scores: { F: 10 } }] },
    { id: 12, text: "离最后期限还有一周：", options: [{ label: "我会提前完成以防万一", scores: { J: 10 } }, { label: "我会等等看，压力往往带给我动力", scores: { P: 10 } }] },
    { id: 13, text: "如果你在社交场合待了一天：", options: [{ label: "我感到精力充沛，甚至想转场", scores: { E: 10 } }, { label: "我感到有些疲惫，需要独处充电", scores: { I: 10 } }] },
    { id: 14, text: "你经常觉得：", options: [{ label: "现实生活太平庸，灵魂在远方", scores: { N: 10 } }, { label: "细节之美就在眼前的生活里", scores: { S: 10 } }] },
    { id: 15, text: "面对争论，你：", options: [{ label: "坚持真理，不惜牺牲关系", scores: { T: 10 } }, { label: "寻求妥协，尽力维持和谐", scores: { F: 10 } }] },
    { id: 16, text: "你喜欢的生活方式：", options: [{ label: "一切都在掌控中带来的安全感", scores: { J: 10 } }, { label: "随风而行带来的惊喜感", scores: { P: 10 } }] }
  ],

  synergyRules: [
    {
      title: '秩序下的鸽王之王',
      reason: '有趣的是，你在追求生活秩序（即便是仪式感）的同时，却在具体的社交行动中展现出极强的随机性和“突然性鸽子”潜质。这说明你只在你真正在意的事情上勤奋。',
      trigger: [{ qId: 16, optIdx: [3, 4] }, { qId: 5, optIdx: [0, 1] }]
    },
    {
      title: '思想的守夜人',
      reason: '你在“逻辑局”的表现与“未来感”的选择产生了跨维度的共鸣。',
      trigger: [{ qId: 11, optIdx: [0, 1] }, { qId: 6, optIdx: [3, 4] }]
    }
  ],

  results: [
    {
      id: 'INTJ', title: 'INTJ - 高冷架构师',
      subtitle: '独立思考的绝对谋略家。',
      description: '你是一个对“蠢”毫无容忍度的绝对独立思考者。你的大脑里装载着一整套精密的生存代码。当别人还在为眼前的琐碎欢呼或落泪时，你早已通过无数次的沙盘推演，在脑海中构建好了十年后的帝国版图。你是人群中最冷的一座冰山，不仅是因为你理性的厚度，更是因为你极少向世界展示那颗脆弱而高傲的灵魂核心。你的存在，本身就是对这个混乱世界的一种无声审判与重构。',
      condition: (s) => (s['I']||0) >= (s['E']||0) && (s['N']||0) >= (s['S']||0) && (s['T']||0) >= (s['F']||0) && (s['J']||0) >= (s['P']||0),
      behavioralAnalysis: "你表现出一种极度的“内在驱动”型行为范式。在面对复杂的决策场景时，你往往不依赖传统的群策群力，而是通过大脑中预设的逻辑模型进行极限对冲。你的沟通风格直接且具有解构性，这种高效的交流方式是为了剔除一切无意义的噪音。然而，这种高频度的逻辑闪烁也会带来人际层面的社交隔阂，你可能在坚忍的执行力与对周围平庸的排斥之间感到孤独，导致你在团队协作中的隐形阻力增大。在深度偏好上，你倾向于通过对知识和权力的掌控来确认自我价值，这种向内坍塌的心理结构让你在寒冬中能保持极度的清醒，但也意味着你对情感反馈的习得成本远超常人，内心世界的孤寂程度相较于其他类型更为深邃。",
      potentialAnalysis: "在未来的演化路径中，你正处于从‘孤独的分析师’向‘具有战略影响力的组织架构师’转化的关键期。你的初级演化阶段是通过不断的算力迭代来填补认知空白，但这种纵向挖掘很快会遇到‘执行孤立’的瓶颈。建议在职业中期的深度进阶中，有意识地训练建立在利益对冲之上的‘情感协议’，将冰冷的逻辑规则转化为可被他人感知的愿景导向。你真正的爆发点在于通过你强大的架构能力去解决具有行业垄断价值的复杂命题，成为规则的制定者。在未来的十年里，随着你内部‘第三功能’（情感功能）的觉醒，你将能够以更具慈悲的视角去审视那些充满瑕疵的众生，从而实现从‘计算世界’到‘理解世界’的本质飞跃。"
    },
    {
      id: 'ENFP', title: 'ENFP - 竞选者',
      subtitle: '自由烂漫的探索者。',
      description: '你是一只无法被任何人定义的自由精灵！你极富感染力和发散性思维，跟你在一起永远不会枯燥。你讨厌平庸，热爱冒险，你的每一个念头都像烟花一样绚烂，即便只是短暂的绽放，也能点亮周围一整片夜空。',
      condition: (s) => (s['E']||0) > (s['I']||0) && (s['N']||0) >= (s['S']||0) && (s['F']||0) > (s['T']||0) && (s['P']||0) > (s['J']||0),
      behavioralAnalysis: "你表现出一种高度灵活且富有感染力的社交行为范式。在面对复杂的决策场景时，你往往不依赖传统的逻辑推演，而是通过敏锐的情感触角捕捉环境中的微妙波动。你的沟通风格极具跳跃性，这种非线性的思维方式让你在创意产出和危机处理中总能给出意想不到的‘第三条路’。然而，这种高频度的直觉闪烁也会带来执行层面的能量涣散，你可能在多个极具诱惑力的起始点之间徘徊，导致核心目标的锁定周期拉长。在深度偏好上，你倾向于通过与世界的交互来确认自我价值，这种外向映射的心理结构让你在团队中扮演着‘能量泵’的角色，但也意味着你对外界反馈的敏感度远超常人，情绪的振幅相较于其他类型更为剧烈。",
      potentialAnalysis: "在未来的演化路径中，你正处于从‘发散性灵感家’向‘极具影响力的战略执行者’转化的关键期。你的初级演化阶段是通过不断的尝试和体验来填充生命的厚度，但这种横向扩张很快会遇到‘效率边际递减’的瓶颈。建议在职业中期的深度进阶中，有意识地训练建立在逻辑闭环之上的情感驱动力，将碎片化的奇思妙想固化为可持续的体系架构。你真正的爆发点在于通过你强大的感召力去驱动具有社会价值的宏大议题，成为某个垂直领域的‘精神领袖’或‘变革催化剂’。在未来的十年里，随着你内部‘第三功能’（逻辑功能）的成熟，你将能够以更冷峻的视角去审视那些温情脉脉的愿景，从而实现从‘被直觉支配’到‘支配直觉’的本质飞跃。"
    },
    // Adding fallbacks for others to ensure they have content too
  ].concat(['INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'].map(id => ({
    id, title: `MBTI - ${id} 深度探测`,
    subtitle: '核心人格深度画像。',
    description: '这是一个基于 MBTI 维度的深度画像... (Fallback content)',
    condition: () => false, // Simplified
    behavioralAnalysis: "在深度行为范式分析中，该类型展现出了极其独特的心理能量流转方式。通过对你 16 道核心行为题目作答的交叉比对，我们发现你在应对不确定性挑战时，拥有一种超乎常人的韧性。这种深度范式不仅仅是行为的简单累加，更是你潜意识底层中对于‘自我界限’与‘世界契合’的平衡结果。当你处于心流状态时，你的认知资源会自动向你的主导功能倾斜，从而在极短时间内完成从信息采集到价值判别的闭环。这种范式的高阶表现是能够将外部的混乱转化为内部的秩序，即便在极端压力下，依然能够保持核心价值观的稳定，不被世俗琐碎所异化。你是规则的重塑者，也是情感的共振器。",
    potentialAnalysis: "关于未来的演化路径，你正站在一个全新的指数级增长点。基于你的心理底色，你未来的突破口在于‘功能整合’带来的维度跨越。你不再仅仅满足于在舒适区内的熟练操作，而是开始尝试调动那些曾经被你压抑的次要功能。这种演化并非对自我的否定，而是一种更高层面的圆满。在接下来的五年到十年中，你将通过一系列关键的外部冲突，完成从‘生存自洽’到‘生命影响力’的飞跃。你不仅能够管理好自己的内在宇宙，更能够成为周围环境的能量之源，驱动更宏大的目标。通过对潜意识碎片的整合，你将逐渐掌握一种‘不费力的掌控感’，在复杂的世界网络中，找到属于你自己的绝对领地。"
  }))),

  valueProps: ["16型人格深解", "交叉行为验证", "灵魂稀缺度分析"],
  analysisSteps: [{ text: "作答碎匹配...", icon: "Fingerprint" }, { text: "画像生成中...", icon: "BrainCircuit" }],
  rarityData: { map: { 'INFJ': 1.5, 'ENTJ': 1.8, 'INTJ': 2.1, 'ENFJ': 2.5, 'ENTP': 3.2, 'INTP': 3.3, 'INFP': 4.4, 'ENFP': 8.1, 'ISTP': 5.4, 'ESTP': 4.3, 'ISFP': 8.8, 'ESFP': 8.5, 'ISTJ': 11.6, 'ISFJ': 13.8, 'ESTJ': 8.7, 'ESFJ': 12.3 } },
  dimensionPairs: [
    { key: 'EI', labelLeft: '内向 (I)', labelRight: '外向 (E)', dimLeft: 'I', dimRight: 'E', colorLeft: 'bg-indigo-500', colorRight: 'bg-orange-500' },
    { key: 'NS', labelLeft: '实感 (S)', labelRight: '直觉 (N)', dimLeft: 'S', dimRight: 'N', colorLeft: 'bg-emerald-500', colorRight: 'bg-purple-500' },
    { key: 'TF', labelLeft: '情感 (F)', labelRight: '逻辑 (T)', dimLeft: 'F', dimRight: 'T', colorLeft: 'bg-rose-500', colorRight: 'bg-blue-500' },
    { key: 'JP', labelLeft: '灵活 (P)', labelRight: '计划 (J)', dimLeft: 'P', dimRight: 'J', colorLeft: 'bg-cyan-500', colorRight: 'bg-amber-500' },
  ],
  advantageLib: {
    'E': { icon: '🚀', title: '社交感染力', desc: '拥有天然气场，点燃冷场氛围。', shortage: '在独处时容易产生严重的虚无感和能量空洞。' },
    'I': { icon: '🧘', title: '深海洞察力', desc: '在喧嚣中保持极度清醒，看透本质。', shortage: '过度内耗，可能在过度思考中错失快速行动的良机。' },
    'N': { icon: '🔮', title: '未来预测者', desc: '发现隐秘的模式和趋势。', shortage: '容易脱离现实，对具体执行层面的琐碎工作极度排斥。' },
    'S': { icon: '🛠️', title: '细节掌控专家', desc: '精准落地任何宏大愿景。', shortage: '固步自封，可能因为过度关注眼前细节而忽略全局变动。' },
    'T': { icon: '⚖️', title: '冷峻逻辑', desc: '剥离情绪干扰，做出理性决策。', shortage: '在处理亲密关系时，可能被贴上“冷血、无法共情”的标签。' },
    'F': { icon: '❤️', title: '共情之桥', desc: '强大的感知能力，团队粘合剂。', shortage: '容易被他人的情绪垃圾淹没，在决策时由于不忍而妥协。' },
    'J': { icon: '📅', title: '秩序架构师', desc: '高效推进项目，让结果如期而至。', shortage: '缺乏灵活性，可能在突发状况面前显得过于僵硬或焦虑。' },
    'P': { icon: '🌊', title: '极速应变者', desc: '在混沌中如鱼得水，捕捉转瞬即逝的机会。', shortage: '缺乏长远规划，可能在重复性的枯燥工作中迅速枯竭。' },
  },
  polarizationLib: {
    'E': { label: '社交活跃度', high: '你是这场派对的绝对恒星', low: '你是一座静静沉思的小岛' },
    'I': { label: '社交活跃度', low: '你是这场派对的绝对恒星', high: '你是一座静静沉思的小岛' },
    'N': { label: '思维前瞻性', high: '你总在观测光年外的可能', low: '你脚下的土地带给你安全感' },
    'S': { label: '思维前瞻性', low: '你总在观测光年外的可能', high: '你脚下的土地带给你安全感' },
    'T': { label: '逻辑穿透力', high: '理性是你切割迷雾的手术刀', low: '共情是你感知温度的触角' },
    'F': { label: '逻辑穿透力', low: '理性是你切割迷雾的手术刀', high: '共情是你感知温度的触角' },
    'J': { label: '秩序把控感', high: '计划是支撑你飞行的引擎', low: '直觉是引导你滑翔的微风' },
    'P': { label: '秩序把控感', low: '计划是支撑你飞行的引擎', high: '直觉是引导你滑翔的微风' },
  },
  defaultResultId: 'ENFP',
  visualization: 'spectrum',
  reportConfig: {
    topCardType: 'rarity',
    advantageMode: 'both'
  }
};

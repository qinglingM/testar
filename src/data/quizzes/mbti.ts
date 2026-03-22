import { QuizDefinition } from '../quiz-schema';
import mbtiCover from '@/assets/covers/mbti.png';
import mbtiIcon from '@/assets/icons/mbti.png';

const spectrumOptions = (posKey: string, negKey: string, weight = 1.0) => [
  { label: "强烈反对", scores: { [negKey]: Number((2 * weight).toFixed(2)) } },
  { label: "反对", scores: { [negKey]: Number((1 * weight).toFixed(2)) } },
  { label: "中立", scores: {} },
  { label: "同意", scores: { [posKey]: Number((1 * weight).toFixed(2)) } },
  { label: "强烈同意", scores: { [posKey]: Number((2 * weight).toFixed(2)) } },
];

export const mbtiQuiz: QuizDefinition = {
  id: 'mbti',
  title: 'MBTI 灵魂探测仪',
  subtitle: '测测你到底是哪种清澈的愚蠢与人间清醒？',
  coverImage: mbtiCover,
  icon: mbtiIcon,
  questionsCount: 20, 
  participantsCount: '24.8万',
  estimatedMinutes: 5,
  visualization: 'spectrum',
  
  reportConfig: {
    topCardType: 'population',
    advantageMode: 'both'
  },
  
  dimensions: [
    { key: 'E', label: '社交悍匪 (E)', colorClass: 'bg-orange-500' },
    { key: 'I', label: '社控退役 (I)', colorClass: 'bg-indigo-500' },
    { key: 'N', label: '脑洞王者 (N)', colorClass: 'bg-purple-500' },
    { key: 'S', label: '人间清醒 (S)', colorClass: 'bg-emerald-500' },
    { key: 'T', label: '没有感情 (T)', colorClass: 'bg-blue-500' },
    { key: 'F', label: '情绪海绵 (F)', colorClass: 'bg-rose-500' },
    { key: 'J', label: '控制狂魔 (J)', colorClass: 'bg-amber-500' },
    { key: 'P', label: '鸽王之王 (P)', colorClass: 'bg-cyan-500' },
  ],

  questions: [
    { id: 1, type: 'spectrum', text: "我非常享受在几十人的大群里发沙雕表情包并被围观。", options: spectrumOptions('E', 'I', 1.2) },
    { id: 2, type: 'spectrum', text: "即便工作了一整周，周五晚上我还是想去人挤人的 Livehouse 充电。", options: spectrumOptions('E', 'I', 1.0) },
    { id: 3, type: 'spectrum', text: "在地铁上遇到认识但不熟的人，我会主动跑过去打招呼并聊一路。", options: spectrumOptions('E', 'I', 1.1) },
    { id: 4, type: 'spectrum', text: "我喜欢在朋友圈高频输出我的生活碎片，并期待每一条点赞。", options: spectrumOptions('E', 'I', 1.0) },
    { id: 5, type: 'spectrum', text: "到一个陌生的社交局，我总是那个忍不住要带节奏、讲笑话破冰的人。", options: spectrumOptions('E', 'I', 1.0) },
    
    { id: 6, type: 'spectrum', text: "我经常想一些毫无卵用但非常有意思的假设，比如外星人占领地球该带哪三样东西。", options: spectrumOptions('N', 'S', 1.2) },
    { id: 7, type: 'spectrum', text: "我讨厌看说明书，更喜欢凭直觉悟出软件背后的运行逻辑。", options: spectrumOptions('N', 'S', 1.0) },
    { id: 8, type: 'spectrum', text: "比起“现在该吃什么”，我更关心“人类十年后会不会被 AI 统治”。", options: spectrumOptions('N', 'S', 1.1) },
    { id: 9, type: 'spectrum', text: "看电影时我最反感平庸的老梗，我需要充满隐喻和神反转的高概念叙事。", options: spectrumOptions('N', 'S', 1.0) },
    { id: 10, type: 'spectrum', text: "我经常觉得自己活在未来，眼下的重复工作只是我达成宏大远景的跳板。", options: spectrumOptions('N', 'S', 1.0) },
    
    { id: 11, type: 'spectrum', text: "朋友来找我哭诉受委屈时，我总是先帮他复盘逻辑，指出他到底错在哪。", options: spectrumOptions('T', 'F', 1.2) },
    { id: 12, type: 'spectrum', text: "在极端的争论中，我认为对错和事实比对方是否感到难过重要得多。", options: spectrumOptions('T', 'F', 1.1) },
    { id: 13, type: 'spectrum', text: "选电脑或选对象时，我有一套极其清晰的利弊指标矩阵，很少被情绪带偏。", options: spectrumOptions('T', 'F', 1.0) },
    { id: 14, type: 'spectrum', text: "我非常欣赏那些能够像机器一样冷静处理突发危机的朋友。", options: spectrumOptions('T', 'F', 1.0) },
    { id: 15, type: 'spectrum', text: "即便面对上司，如果他逻辑混乱，我也会忍不住当众戳破这个事实。", options: spectrumOptions('T', 'F', 1.0) },
    
    { id: 16, type: 'spectrum', text: "去异地旅游前，我必须列好精确到小时的 Excel 攻略，否则我会焦虑致死。", options: spectrumOptions('J', 'P', 1.2) },
    { id: 17, type: 'spectrum', text: "我无法忍受任何未竟的事宜，哪怕是熬夜我也要把下周的工作提前清仓。", options: spectrumOptions('J', 'P', 1.1) },
    { id: 18, type: 'spectrum', text: "我极度反感那些突然闯入我生活、打乱我既定计划的“意外惊喜”。", options: spectrumOptions('J', 'P', 1.0) },
    { id: 19, type: 'spectrum', text: "我的手机桌面和文件系统非常有秩序，分类文件夹里绝不会出现多余杂物。", options: spectrumOptions('J', 'P', 1.0) },
    { id: 20, type: 'spectrum', text: "如果生活没有一条确定的主轨道让我在攀爬，我会觉得自己正在虚度光阴。", options: spectrumOptions('J', 'P', 1.0) }
  ],

  defaultResultId: 'ENFP',
  
  synergyRules: [
    {
      title: '高能量理性主义',
      reason: '你不仅拥有一颗外向火热的社交心，在面临原则问题时却展现出近乎冷酷的逻辑一致性。这种“火中带冰”的特质让你在人群中既是领袖又是判官。',
      trigger: [{ qId: 1, optIdx: [3, 4] }, { qId: 11, optIdx: [3, 4] }]
    },
    {
      title: '孤独的理想主义者',
      reason: '你对精神世界的追求是极致的，同时你又极度需要独立的空间来消化这些脑洞。你经常在人群中感到疏离，但这正是你构建宏大愿景的代价。',
      trigger: [{ qId: 6, optIdx: [3, 4] }, { qId: 3, optIdx: [0, 1] }]
    },
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
      condition: (s) => (s['I']||0) >= (s['E']||0) && (s['N']||0) >= (s['S']||0) && (s['T']||0) >= (s['F']||0) && (s['J']||0) >= (s['P']||0)
    },
    { id: 'INTP', title: 'INTP - 逻辑极客', subtitle: '推演宇宙规律的隐士。', description: '你拥有极其恐怖的抽象解构能力。你像一只猫一样与世无争，只在自己的精神洞穴里把玩着最纯粹的真理。你的思维跳跃且深邃，常人很难跟上你的节奏。你对世俗规则的冷漠并非傲慢，而是因为你太忙于构建那个由于逻辑自洽而诞生的新世界。', condition: (s) => (s['I']||0) >= (s['E']||0) && (s['N']||0) >= (s['S']||0) && (s['T']||0) >= (s['F']||0) && (s['P']||0) > (s['J']||0) },
    { id: 'ENTJ', title: 'ENTJ - 指挥官', subtitle: '决定胜负的战略发动机。', description: '你身上流淌的是绝对王者的铁血。你是最不知疲倦的战略发动机，你存在的意义就是把混乱的乌合之众变成无坚不摧的战车。你的果敢和远见不仅让你能赢下眼前的竞争，更让你在时代的浪潮中总能准确地踩中每一个关键的跳板。', condition: (s) => (s['E']||0) > (s['I']||0) && (s['N']||0) >= (s['S']||0) && (s['T']||0) >= (s['F']||0) && (s['J']||0) >= (s['P']||0) },
    { id: 'ENTP', title: 'ENTP - 辩论家', subtitle: '专破陈规的智力魔王。', description: '你的脑子极其迷人且危险。你总能用最犀利刁钻的角度，把那些僵化的老学究驳斥得体无完肤。你讨厌无聊，就像鱼讨厌干旱。你毕生都在寻找更刺激的脑力较量，任何现有的成就都无法让你停下那颗永不停歇的探索之心。', condition: (s) => (s['E']||0) > (s['I']||0) && (s['N']||0) >= (s['S']||0) && (s['T']||0) >= (s['F']||0) && (s['P']||0) > (s['J']||0) },
    { id: 'INFJ', title: 'INFJ - 提倡者', subtitle: '洞察人性的先知。', description: '你同时拥有着极度的感性拉扯和冷酷的理智判断。你洞察一切疾苦，但千万不要为了拯救别人把自己当成柴火烧了。你是一个矛盾的集合体：一方面你希望能深度链接众生，另一方面你由于看得太透而产生的幻灭感让你不得不退回那座孤岛。', condition: (s) => (s['I']||0) >= (s['E']||0) && (s['N']||0) >= (s['S']||0) && (s['F']||0) > (s['T']||0) && (s['J']||0) >= (s['P']||0) },
    { id: 'INFP', title: 'INFP - 调解者', subtitle: '内心绚烂的诗人。', description: '你大概是世界上最柔软、最有共鸣、也最容易受伤的灵魂。在你眼里，这个世界永远覆盖着一层带有淡淡忧伤的诗意。你对他人的痛苦有着某种“跨时空”的感应，这种强大的情感天赋既是你的软肋，也是你对抗这个庸常世界最尖锐的武器。', condition: (s) => (s['I']||0) >= (s['E']||0) && (s['N']||0) >= (s['S']||0) && (s['F']||0) > (s['T']||0) && (s['P']||0) > (s['J']||0) },
    { id: 'ENFJ', title: 'ENFJ - 主人公', subtitle: '点燃热情的太阳。', description: '你是那种只要出现，就会让周围人如沐春风的无私教导者。你本能地知道怎么去点燃别人。你的生命力在于你对他人的正面影响，你习惯于扛起集体的旗帜，在追梦的路上你从不孤单，因为你本身就是那个巨大的磁场。', condition: (s) => (s['E']||0) > (s['I']||0) && (s['N']||0) >= (s['S']||0) && (s['F']||0) > (s['T']||0) && (s['J']||0) >= (s['P']||0) },
    { id: 'ENFP', title: 'ENFP - 竞选者', subtitle: '自由烂漫的探索者。', description: '你是一只无法被任何人定义的自由精灵！你极富感染力和发散性思维，跟你在一起永远不会枯燥。你讨厌平庸，热爱冒险，你的每一个念头都像烟花一样绚烂，即便只是短暂的绽放，也能点亮周围一整片夜空。', condition: (s) => (s['E']||0) > (s['I']||0) && (s['N']||0) >= (s['S']||0) && (s['F']||0) > (s['T']||0) && (s['P']||0) > (s['J']||0) },
    { id: 'ISTJ', title: 'ISTJ - 物流师', subtitle: '绝对可靠的精密锁。', description: '你是一台绝对可靠的精密时钟。你不懂浪漫的花言巧语，但你用极其可怕的忠诚和规矩庇护着你爱的人。你是社会的基石，是秩序的最后守护者。在所有人都在追求浮夸的虚名时，只有你会在夜里反复确认那颗螺丝钉是否松动。', condition: (s) => (s['I']||0) >= (s['E']||0) && (s['S']||0) > (s['N']||0) && (s['T']||0) >= (s['F']||0) && (s['J']||0) >= (s['P']||0) },
    { id: 'ISFJ', title: 'ISFJ - 守卫者', subtitle: '无私奉献的守护神。', description: '你是最有大爱精神的奉献者。你温顺细致，默默记忆着环境里每一个微小的需求。你的温暖是不带任何侵略性的，像冬日里的炉火，静静地燃烧，为周围的人撑起一片免受严寒侵袭的净土。', condition: (s) => (s['I']||0) >= (s['E']||0) && (s['S']||0) > (s['N']||0) && (s['F']||0) > (s['T']||0) && (s['J']||0) >= (s['P']||0) },
    { id: 'ESTJ', title: 'ESTJ - 总管', subtitle: '秩序与效率的捍卫者。', description: '你是建立规则和执行纪律的神。“不要跟我扯情怀，告诉我进度到哪了”。你的强大源于你对社会现实规则的深刻理解和运用。你不是在管理，你是在用法律和效率的高墙，为群体圈出一块能持续产生价值的绿洲。', condition: (s) => (s['E']||0) > (s['I']||0) && (s['S']||0) > (s['N']||0) && (s['T']||0) >= (s['F']||0) && (s['J']||0) >= (s['P']||0) },
    { id: 'ESFJ', title: 'ESFJ - 执政官', subtitle: '活跃气氛的纽带。', description: '你是人类社交网络中最坚实的维系节点。你极度渴望和谐、极其外放热情。你的满足感源于每一个被照顾好的细节和每一声真诚的感谢。你是团队中的粘合剂，是那个能在冷场瞬间用一个家常话题救市的社交大师。', condition: (s) => (s['E']||0) > (s['I']||0) && (s['S']||0) > (s['N']||0) && (s['F']||0) > (s['T']||0) && (s['J']||0) >= (s['P']||0) },
    { id: 'ISTP', title: 'ISTP - 鉴赏家', subtitle: '冷静果断的行动派。', description: '你是天生自带冷感的行动派。你看似漫不经心，实则有着变态级别的抗压能力和掌控力。在危急关头，当所有人都在恐慌时，你早已算好了逃生曲线或反杀逻辑。你是一个孤独的工匠，更愿意用你的作品和结果去和这个世界对话。', condition: (s) => (s['I']||0) >= (s['E']||0) && (s['S']||0) > (s['N']||0) && (s['T']||0) >= (s['F']||0) && (s['P']||0) > (s['J']||0) },
    { id: 'ISFP', title: 'ISFP - 探险家', subtitle: '松弛自由的灵魂。', description: '你身上有一种毫不费力的松弛与美感。你极其珍视自己的独立空间和价值观。你不是在探索远方的荒原，而是在探索内心的每一个艺术角落。你的一举一动都充满了不可复制的韵律，你是那种即便在泥泞中也能开出奇异花朵的人。', condition: (s) => (s['I']||0) >= (s['E']||0) && (s['S']||0) > (s['N']||0) && (s['F']||0) > (s['T']||0) && (s['P']||0) > (s['J']||0) },
    { id: 'ESTP', title: 'ESTP - 企业家', subtitle: '活在当下的梭哈者。', description: '你是真正活在“当下这一秒”的人。只要能刺激你多分泌一点多巴胺，你就敢直接踩下一脚地板油。你的敏捷反映和对风险的狂热让你在瞬息万变的市场或战场中总能抢到第一口肉。不要跟谈什么长远规划，你只在乎当下的心流体验。', condition: (s) => (s['E']||0) > (s['I']||0) && (s['S']||0) > (s['N']||0) && (s['T']||0) >= (s['F']||0) && (s['P']||0) > (s['J']||0) },
    { id: 'ESFP', title: 'ESFP - 表演者', subtitle: '闪耀全场的戏精。', description: '你是一团永远在熊熊燃烧的火把！你走到哪，哪里的沉闷就会立刻解冻。你的天赋在于你对“快乐”这种能量极其原始且纯粹的搬运能力。你不是在表演，你是在用你整个生命去抗拒无趣和孤独，你是人群中永远的 100% 满格信号。', condition: (s) => (s['E']||0) > (s['I']||0) && (s['S']||0) > (s['N']||0) && (s['F']||0) > (s['T']||0) && (s['P']||0) > (s['J']||0) }
  ],

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
    'J': { icon: '📅', title: '秩序架构师', desc: '将混乱转化为可控清单。', shortage: '控制欲过强，一旦计划被打乱会陷入歇斯底里的焦虑。' },
    'P': { icon: '🌊', title: '动态适应者', desc: '在变局中发现生机。', shortage: '严重的拖延症倾向，可能导致重要项目在最后关头失控。' },
  }
};

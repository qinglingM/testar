import { QuizDefinition } from '../quiz-schema';
import cityCover from '@/assets/covers/mbti.png'; 
import cityIcon from '@/assets/icons/mbti.png';

const spectrumOptions = (posKey: string, negKey: string, weight = 1.0) => [
  { label: "逃离", scores: { [negKey]: 2 * weight } },
  { label: "观望", scores: { [negKey]: 1 * weight } },
  { label: "中立", scores: {} },
  { label: "向往", scores: { [posKey]: 1 * weight } },
  { label: "扎根", scores: { [posKey]: 2 * weight } },
];

export const cityQuiz: QuizDefinition = {
  id: 'city',
  title: '全球华人心灵栖息地：梦想城市匹配测试',
  subtitle: '在 30 座顶级宜居/旅居名城中，寻找你下半生的灵魂坐标',
  coverImage: cityCover,
  icon: cityIcon,
  questionsCount: 25,
  participantsCount: '15.8万',
  estimatedMinutes: 8,
  visualization: 'radar',
  
  reportConfig: {
    topCardType: 'rarity',
    advantageMode: 'both'
  },

  dimensions: [
    { key: 'MAT', label: '物质追求', colorClass: 'bg-emerald-500' }, // 经济、便利、繁华
    { key: 'SOC', label: '社交偏好', colorClass: 'bg-blue-500' },    // 烟火气、文化、圈子
    { key: 'DES', label: '底层欲望', colorClass: 'bg-purple-500' },  // 自由、权力、安稳
    { key: 'STG', label: '人生阶段', colorClass: 'bg-amber-500' },   // 奋斗、平躺、养老
    { key: 'EMO', label: '情感归属', colorClass: 'bg-rose-500' },    // 土地认同、故乡感
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
    // Adding 10 more questions to differentiate cities
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

  defaultResultId: 'Chengdu',
  results: [
    { 
      id: 'Chengdu', title: '成都\n烟火里的慢哲思', subtitle: '安逸与奋斗的量子叠加态。', 
      description: '成都不仅是一座城，更是一种对抗世界粗暴逻辑的温柔。你在这里能找到对“安逸”最高级的定义：在物质并不匮乏的基础上，保持对生活的热爱。',
      condition: (s) => (s['SOC']||0) > 4 && (s['EMO']||0) > 4 && (s['MAT']||0) < 12,
      cityBaseline: { MAT: 65, SOC: 95, DES: 70, STG: 40, EMO: 85 },
      cityTags: ['巴适平衡者', '烟火守望者', '松弛感大师'],
      sloganMatrix: {
        MAT: ["消费主义的温柔乡", "物价适中生活的平衡点", "二线城市里的顶奢场"],
        SOC: ["满城麻将声里的熟人社会", "最具包容性的城市客厅", "青年亚文化的创作温床"],
        DES: ["在这里，平庸也是一种正义", "拒绝内卷的最后堡垒", "让野心自然氧化的土地"],
        STG: ["适合三十岁后的二次创业", "最温柔的半坡停靠站", "养老与新潮的完美结合"],
        EMO: ["来了就不想走的温柔乡", "寻找灵魂第二故乡的首选", "川江水里的情感归宿"]
      },
      paidAnalysis: {
        whySuits: "你的社交需求与情感归属处于极高频率，而成都特有的街头文化能瞬间填满你的孤独感。",
        notSuits: "如果你是极致的高效率追求者，这里的慢节奏可能会让你产生虚度光阴的道德罪恶感。",
        futurePath: "尝试在数字创意或生活方式零售领域深耕，这里有最适合播种感性商业的土壤。",
        peers: "追求生活质量的高管、数字游民、感性艺术家。"
      }
    },
    { 
      id: 'Hangzhou', title: '杭州\n数字时代的精致隐逸', subtitle: '在赛博与山水之间精准穿梭。', 
      description: '你既迷恋数字科技带来的极致效率，又在灵魂深处藏着西湖烟雨的诗意。杭州是唯一能满足你这种双重贪婪性的城市。',
      condition: (s) => (s['MAT']||0) > 10 && (s['STG']||0) > 8,
      cityBaseline: { MAT: 95, SOC: 70, DES: 80, STG: 90, EMO: 75 },
      cityTags: ['赛博修仙者', '精致利己+灵性', '互联网贵族'],
      sloganMatrix: {
        MAT: ["算法织就的黄金地", "离财富最近的距离", "极高效率的物质保障"],
        SOC: ["顶级互联网圈层准入证", "咖啡馆里的创业BP会", "精致白领的社交样板间"],
        DES: ["对成功的渴望与湖山的平衡", "在物质巅峰寻找一抹宁静", "权力与美的某种妥协"],
        STG: ["事业上升期的核动力引擎", "新中产的定居锚点", "高管后的隐遁场"],
        EMO: ["钱塘江畔的安全感", "互联网人的归依感", "一种被文明充分照顾的优越感"]
      },
      paidAnalysis: {
        whySuits: "杭州的物质支撑（MAT）与情感锚点（EMO）高度重合，能让你在获得世俗成功的同时不至于精神干枯。",
        notSuits: "高昂的生活成本与极其激烈的隐性竞争，可能会让你在长跑中感到精疲力竭。",
        futurePath: "高科技、新媒体或金融。利用城市的平台效应实现跨越式增长。",
        peers: "创业家、互联网精英、追求极致审美的理智派。"
      }
    },
    { 
      id: 'Dali', title: '大理\n精神游离的彼岸', subtitle: '逃离系统的终极出口。', 
      description: '大理不是一座地理意义上的城，而是一个心理意义上的缓冲垫。它收留了所有在钢铁森林里感到呼吸困难的火种，并让它们在苍山洱海间缓慢燃烧。',
      condition: (s) => (s['DES']||0) > 12 && (s['EMO']||0) > 8 && (s['MAT']||0) < 6,
      cityBaseline: { MAT: 30, SOC: 85, DES: 95, STG: 20, EMO: 90 },
      cityTags: ['数字游民锚点', '灵性追求者', '反内卷盟主'],
      sloganMatrix: {
        MAT: ["低欲望社会的避风港", "物质平替之都", "用极低生活成本换取极高阳光"],
        SOC: ["没有甲方，只有街头民谣", "苍山脚下的自由公社", "全国文艺青年的耶路撒冷"],
        DES: ["在这里，自由比成功更值钱", "逃离系统的最后一张船票", "重建自我的修道场"],
        STG: ["适合三十岁后的职场大逃亡", "重启人生的避难所", "精神上的落脚点"],
        EMO: ["风花雪月里的灵魂安居", "寻找另一种可能性的发源地", "洱海边的温柔故乡"]
      },
      paidAnalysis: {
        whySuits: "你的底层欲望（DES）倾向于极致的个人掌控与灵性自由，大理的松散组织形式是你的完美居所。",
        notSuits: "如果你仍有极强的世俗权力野心，这里的懈怠氛围可能会在半年后让你感到恐慌。",
        futurePath: "民宿主理人、自由撰稿人、线上远程办公者。在大理，副业才是真正的生活。",
        peers: "自由职业者、诗人、大厂离职的中层、修禅者。"
      }
    },
    { 
      id: 'Nanjing', title: '南京\n金陵旧梦的守墓人', subtitle: '醇厚内敛的文化定力。', 
      description: '南京有一种看透世事的厚重，走在梧桐树下，你能感受到一种巨大的历史惯性。',
      condition: (s) => (s['EMO']||0) > 10 && (s['SOC']||0) > 8 && (s['STG']||0) > 5,
      cityBaseline: { MAT: 85, SOC: 90, DES: 75, STG: 60, EMO: 85 },
      cityTags: ['金陵守望者', '文化定力派', '传统儒雅中产'],
      sloganMatrix: {
        MAT: ["梧桐阴里的老钱味", "稳健且踏实的物质底色", "不显山不露水的富足"],
        SOC: ["茶馆里的政商古意", "大学城外的知性社交圈", "温厚传统的亲邻社会"],
        DES: ["追求内心的儒雅安稳", "拒绝激进变革的保守自由", "历史底蕴带来的生存自信"],
        STG: ["成熟期人士的定居首选", "名校包围的教育高地", "职场高管的平坡换挡"],
        EMO: ["虎踞龙盘里的归属感", "金陵秦淮的文化根脉", "一种无法被现代性剥离的身份"]
      },
      paidAnalysis: {
        whySuits: "你的社交（SOC）与情感（EMO）需求都倾向于稳健与底蕴。南京的中庸之道最符合你的行为逻辑。",
        notSuits: "如果你正在寻找爆发性强、充满颠覆性的互联网式野心场，南京的节奏可能显得过于古板。",
        futurePath: "体制内精英、高端教育、学术科研 or 有积累的传统行业。",
        peers: "公务员、教授、历史迷、拥有家族产业的精英。"
      }
    },
    { 
      id: 'Lhasa', title: '拉萨\n日光之城的圣洁孤勇', subtitle: '信仰与高原的极致洗礼。', 
      description: '拉萨不仅是海拔的高度，更是灵魂的高度。它强制你剥离物质的虚饰，在日光的直射下直面真实的自我。',
      condition: (s) => (s['DES']||0) > 15 && (s['EMO']||0) > 12,
      cityBaseline: { MAT: 30, SOC: 70, DES: 100, STG: 20, EMO: 95 },
      cityTags: ['极乐朝圣者', '信仰力量感', '灵魂高原驻民'],
      sloganMatrix: {
        MAT: ["被稀释的物质欲望", "阳光是唯一的奢侈品", "生活在最纯净的匮乏中"],
        SOC: ["大昭寺前的磕长头者", "甜茶馆里的众生平等", "超越血缘的精神链接"],
        DES: ["离神最近的维度", "在稀薄空气中寻找存在感", "一次彻底的心理重建"],
        STG: ["追求人生终极答案的终局", "不是去旅游，是去归依", "最神圣的避难所"],
        EMO: ["雪山之巅的情感归属", "布达拉宫下的宁静", "一种与苍穹融为一体的宿命感"]
      },
      paidAnalysis: {
        whySuits: "你正处于对生命本质高度渴求的阶段（DES），拉萨那种近乎蛮荒的宗教神性最能击中你的软肋。",
        notSuits: "身体机能的严峻挑战与极其单调的现代娱乐，会过滤掉所有由于一时冲动而来的追随者。",
        futurePath: "宗教文化研究、非遗手工艺、或是深度人文旅行导向的慢商业。",
        peers: "朝圣者、极限登山者、追求精神觉悟的精英、艺术家。"
      }
    },
    { id: 'Weihai', title: '威海\n孤独深蓝的北境童话', subtitle: '在世界尽头看海。', 
      condition: (s) => (s['DES']||0) > 10 && (s['MAT']||0) < 5,
      cityBaseline: { MAT: 65, SOC: 50, DES: 95, STG: 40, EMO: 85 },
      cityTags: ['深蓝孤独者', '干净到透明', '北境浪漫派']
    },
    { id: 'Suzhou', title: '苏州\n现代园林的苏式隐喻', subtitle: '在极富与极静中优雅踱步。', 
      condition: (s) => (s['MAT']||0) > 12 && (s['EMO']||0) > 10,
      cityBaseline: { MAT: 90, SOC: 80, DES: 75, STG: 70, EMO: 90 }
    },
    { id: 'Chongqing', title: '重庆\n赛博森林的魔幻折叠', subtitle: '热烈、垂直、永不眠。', 
      condition: (s) => (s['SOC']||0) > 12 && (s['STG']||0) > 10,
      cityBaseline: { MAT: 80, SOC: 95, DES: 65, STG: 90, EMO: 70 }
    },
    { id: 'Kunming', title: '昆明\n永恒的春之镜像', subtitle: '被天气极度宠溺。', 
      condition: (s) => (s['STG']||0) < 5 && (s['EMO']||0) > 8,
      cityBaseline: { MAT: 60, SOC: 85, DES: 50, STG: 30, EMO: 95 }
    },
    { id: 'Dalian', title: '大连\n碧海下的北方老派浪漫', subtitle: '旧工业时代的海洋温柔。',
      condition: (s) => (s['STG']||0) > 6 && (s['EMO']||0) > 6 && (s['SOC']||0) < 5, 
      cityBaseline: { MAT: 80, SOC: 75, DES: 70, STG: 60, EMO: 70 }
    },
    { id: 'Jingdezhen', title: '景德镇\n泥土与窑火的避世所', subtitle: '在这里，失败也是一种艺术。', 
      condition: (s) => (s['SOC']||0) > 10 && (s['DES']||0) > 10,
      cityBaseline: { MAT: 50, SOC: 90, DES: 90, STG: 35, EMO: 80 }
    },
    { id: 'Xiamen', title: '厦门\n海洋信徒的避风港', subtitle: '精致到骨子里的闽南慢调。', 
      condition: (s) => (s['EMO']||0) > 12 && (s['MAT']||0) > 8,
      cityBaseline: { MAT: 80, SOC: 80, DES: 60, STG: 70, EMO: 95 }
    },
    { id: 'Changsha', title: '长沙\n热辣鲜活的现实狂欢', subtitle: '娱乐星城的永动能量。', 
      condition: (s) => (s['SOC']||0) > 15,
      cityBaseline: { MAT: 70, SOC: 100, DES: 60, STG: 85, EMO: 60 }
    },
    { id: 'Xian', title: '西安\n秦砖汉瓦的赛博叙事', subtitle: '每一个路口都通往长安。', 
      condition: (s) => (s['EMO']||0) > 15,
      cityBaseline: { MAT: 75, SOC: 85, DES: 65, STG: 50, EMO: 100 }
    },
    { id: 'Sanya', title: '三亚\n热带激情的北纬十八度', subtitle: '北方的南方，海洋的征途。', 
      condition: (s) => (s['STG']||0) > 12 && (s['MAT']||0) > 10,
      cityBaseline: { MAT: 85, SOC: 80, DES: 70, STG: 40, EMO: 75 }
    },
    // Adding more unique cities to reach toward 30
    { id: 'Zhuhai', title: '珠海', subtitle: '最体面的退休前哨。', condition: (s) => (s['STG']||0) < 4 && (s['MAT']||0) > 10, cityBaseline: { MAT: 75, SOC: 60, DES: 65, STG: 40, EMO: 90 } },
    { id: 'Quanzhou', title: '泉州', subtitle: '神灵在隔壁喝茶的城市。', condition: (s) => (s['EMO']||0) > 18, cityBaseline: { MAT: 70, SOC: 95, DES: 60, STG: 45, EMO: 100 } },
    { id: 'Urumqi', title: '乌鲁木齐', subtitle: '亚欧大陆的核心律动。', condition: (s) => (s['SOC']||0) > 12 && (s['EMO']||0) > 8, cityBaseline: { MAT: 65, SOC: 90, DES: 80, STG: 70, EMO: 85 } },
    { id: 'Harbin', title: '哈尔滨', subtitle: '冰火交织的东方莫斯科。', condition: (s) => (s['SOC']||0) > 10 && (s['EMO']||0) < 5, cityBaseline: { MAT: 70, SOC: 95, DES: 60, STG: 80, EMO: 65 } },
    { id: 'Haikou', title: '海口', subtitle: '被三亚推开后的宁静省会。', condition: (s) => (s['EMO']||0) > 10 && (s['MAT']||0) < 10, cityBaseline: { MAT: 80, SOC: 70, DES: 60, STG: 50, EMO: 90 } },
    { id: 'Guilin', title: '桂林', subtitle: '山水间的隐世者。', condition: (s) => (s['DES']||0) > 15 && (s['SOC']||0) < 5, cityBaseline: { MAT: 40, SOC: 60, DES: 100, STG: 30, EMO: 95 } },
    { id: 'Yantai', title: '烟台', subtitle: '仙境中的葡萄庄园。', condition: (s) => (s['STG']||0) < 5 && (s['EMO']||0) > 12, cityBaseline: { MAT: 75, SOC: 70, DES: 70, STG: 40, EMO: 95 } },
    { id: 'Fuzhou', title: '福州', subtitle: '有福之州的低调幸福。', condition: (s) => (s['EMO']||0) > 10 && (s['STG']||0) < 6, cityBaseline: { MAT: 85, SOC: 75, DES: 60, STG: 45, EMO: 90 } },
    { id: 'Taiyuan', title: '太原', subtitle: '龙城的厚重脊梁。', condition: (s) => (s['EMO']||0) > 12 && (s['SOC']||0) > 10, cityBaseline: { MAT: 80, SOC: 85, DES: 80, STG: 60, EMO: 85 } },
    { id: 'Nanning', title: '南宁', subtitle: '绿城的慢摇之夏。', condition: (s) => (s['SOC']||0) > 15, cityBaseline: { MAT: 65, SOC: 95, DES: 50, STG: 60, EMO: 80 } },
    { id: 'Wuxi', title: '无锡', subtitle: '太湖明珠的锦绣繁华。', condition: (s) => (s['MAT']||0) > 15 && (s['EMO']||0) > 8, cityBaseline: { MAT: 95, SOC: 80, DES: 70, STG: 70, EMO: 85 } },
    { id: 'Ningbo', title: '宁波', subtitle: '商帮文化里的务实港湾。', condition: (s) => (s['MAT']||0) > 18, cityBaseline: { MAT: 100, SOC: 75, DES: 85, STG: 85, EMO: 80 } },
  ],
  rarityData: { map: { 'Chengdu': 12.8, 'Hangzhou': 8.5, 'Dali': 3.2, 'Lhasa': 1.5, 'Jingdezhen': 0.8 } },
  advantageLib: {
    'MAT': { icon: '💰', title: '物质掌控', desc: '在极高的经济流动性中，你能自如地调集资源。', shortage: '可能导致你在关系中表现得过于功利。' },
    'SOC': { icon: '🏮', title: '社会链接', desc: '在烟火气与熟人社会中，你能迅速建立信任。', shortage: '过多的无效社交可能会吞吞噬你的个人提升时间。' },
    'DES': { icon: '🦅', title: '底层自由', desc: '追求绝对的自我掌控，拒绝被系统异化。', shortage: '在需要团队协作的现代职场中可能表现得格格不入。' },
  },
  valueProps: ["五维定义测评", "灵魂坐标定位", "梦想城市画像"],
  analysisSteps: [{ text: "扫描人生阶段...", icon: "User" }, { text: "测算底层欲望...", icon: "Star" }, { text: "识别城市基因...", icon: "Compass" }]
};

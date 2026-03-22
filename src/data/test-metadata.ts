import { Brain, Heart, Zap, Star, Sparkles, Target } from "lucide-react";

export interface TestMetadata {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  questions: number;
  participants: string;
  color: string;
  intensity: number;
}

export const ALL_TESTS: TestMetadata[] = [
  {
    id: "mbti",
    title: "MBTI 灵魂探测仪",
    subtitle: "测测你到底是哪种清澈的愚蠢与人间清醒？",
    icon: Brain,
    questions: 20,
    participants: "24.8万",
    color: "from-primary to-accent",
    intensity: 98,
  },
  {
    id: "love",
    title: "恋爱依恋模式测评",
    subtitle: "揭秘亲密关系中的安全感来源，看清你的爱与怕",
    icon: Heart,
    questions: 12,
    participants: "8.7万",
    color: "from-pink-500 to-rose-400",
    intensity: 85,
  },
  {
    id: "career",
    title: "职业优势分析",
    subtitle: "别卷了，先看看你的天赋在哪条赛道，精准降维打击",
    icon: Zap,
    questions: 16,
    participants: "6.2万",
    color: "from-amber-500 to-orange-400",
    intensity: 72,
  },
  {
    id: "eq",
    title: "情商指数测评",
    subtitle: "透视你的社交天花板，看清你在人群中的能量位阶",
    icon: Star,
    questions: 20,
    participants: "9.1万",
    color: "from-emerald-500 to-teal-400",
    intensity: 91,
  },
  {
    id: "enneagram",
    title: "九型人格专业版",
    subtitle: "探寻行为背后的原始动机与性格内核",
    icon: Sparkles,
    questions: 18,
    participants: "5.3万",
    color: "from-orange-500 to-amber-400",
    intensity: 78,
  },
  {
    id: "disc",
    title: "DISC 行为风格",
    subtitle: "精准定位你的职场能量位阶与核心竞争力",
    icon: Target,
    questions: 10,
    participants: "4.1万",
    color: "from-blue-500 to-indigo-400",
    intensity: 65,
  }
];

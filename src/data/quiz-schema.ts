// src/data/quiz-schema.ts

export type DimensionKey = string; // e.g., 'E', 'I', 'S', 'N'

export interface QuizOption {
  label: string; // The text of the option
  explanation?: string; // Deep psychic meaning behind this choice (revealed in paid report)
  scores: Partial<Record<DimensionKey, number>>; // How many points this adds to certain dimensions
}

export interface QuizQuestion {
  id: string | number;
  text: string;
  type?: 'choice' | 'spectrum'; // 'choice' is default list, 'spectrum' is 5-point scale
  options: QuizOption[];
}

export interface QuizResultRule {
  id: string; // e.g., 'ENFP'
  title: string; // e.g., 'ENFP - 竞选者'
  subtitle: string;
  description?: string;
  condition: (scores: Record<DimensionKey, number>) => boolean; 
  // Custom Metadata (e.g. for City Quiz)
  cityTags?: string[];
  sloganMatrix?: Record<DimensionKey, string[]>;
  cityBaseline?: Record<DimensionKey, number>;
  paidAnalysis?: {
    coreDescription: string;
    whySuits: string;
    notSuits: string;
    futurePath: string;
    peers: string;
  };
  behavioralAnalysis?: string; // 200-word deep analysis
  potentialAnalysis?: string;  // 200-word future path
}

export interface QuizDefinition {
  id: string;           // e.g., 'mbti'
  title: string;        // e.g., 'MBTI 人格探测'
  subtitle: string;     // Short description for details page
  coverImage?: string;
  icon?: string;
  questionsCount: number; 
  participantsCount: string | number; // Standardized as string or number
  estimatedMinutes?: number;
  
  // Dimensions this quiz measures
  dimensions: Array<{
    key: DimensionKey;
    label: string; // e.g., '外向性 (E)'
    colorClass?: string;
  }>;
  
  questions: QuizQuestion[];
  results: QuizResultRule[];
  defaultResultId: string; 
  visualization?: 'spectrum' | 'radar'; 

  // Individualization Metadata
  valueProps?: string[]; // e.g., ["深度的核心性格维度剖析", ...]
  analysisSteps?: Array<{ text: string; icon: string }>; // e.g., ["正在收集作答碎片...", ...]
  rarityData?: {
    description?: string; // e.g. "基于全球 16Personalities 大数据..."
    map: Record<string, number>; // Result ID -> Percentage
  };
  synergyRules?: Array<{
    title: string;
    reason: string;
    // Condition: List of { qId, optIdx } that MUST match.
    // If multiple items, all must match (AND logic).
    trigger: Array<{ qId: string | number; optIdx: number[] }>;
  }>;
  dimensionPairs?: Array<{
    key: string;
    labelLeft: string;
    labelRight: string;
    dimLeft: DimensionKey; // Dimension that represents the LEFT side (negative value relative to right)
    dimRight: DimensionKey; // Dimension that represents the RIGHT side
    colorLeft: string;
    colorRight: string;
  }>;
  advantageLib?: Record<DimensionKey, { icon: string; title: string; desc: string; shortage?: string }>;
  polarizationLib?: Record<DimensionKey, { label: string; high: string; low: string }>;
  
  reportConfig?: {
    topCardType?: 'rarity' | 'population';
    advantageMode?: 'only_pros' | 'both';
  };
  reportTips?: string[];
  relationshipAdvice?: string;
}

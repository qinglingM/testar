import { mbtiQuiz } from '../quizzes/mbti';
import { enneagramQuiz } from '../quizzes/enneagram';
import { attachmentQuiz } from '../quizzes/attachment';
import { discQuiz } from '../quizzes/disc';
import { eqQuiz } from '../quizzes/eq';
import { careerQuiz } from '../quizzes/career';
import { cityQuiz } from '../quizzes/city'; // Added import for cityQuiz
import { QuizDefinition } from '../quiz-schema';

// Central registry for all available quizzes
export const quizRegistry: Record<string, QuizDefinition> = {
  mbti: mbtiQuiz,
  enneagram: enneagramQuiz,
  love: attachmentQuiz,
  disc: discQuiz,
  eq: eqQuiz,
  career: careerQuiz,
  city: cityQuiz // Added cityQuiz to quizRegistry
};

// New ALL_TESTS array based on the provided structure in the instruction
export const ALL_TESTS = [
  { id: 'mbti', title: 'MBTI 灵魂探测仪', questions: 28, participants: 248692, color: 'bg-blue-500' },
  { id: 'enneagram', title: '九型人格专业版', questions: 36, participants: 53289, color: 'bg-purple-500' },
  { id: 'love', title: '恋爱依恋模式测评', questions: 12, participants: 87412, color: 'bg-rose-500' },
  { id: 'disc', title: 'DISC 行为风格', questions: 24, participants: 41530, color: 'bg-yellow-500' },
  { id: 'eq', title: '情商指数测评', questions: 20, participants: 91043, color: 'bg-green-500' },
  { id: 'career', title: '职业优势分析', questions: 30, participants: 62158, color: 'bg-indigo-500' },
  { id: 'city', title: '心灵归宿城市测试', questions: 25, participants: 158221, color: 'bg-emerald-500' },
];

export const getQuizDef = (slug: string): QuizDefinition | undefined => {
  return quizRegistry[slug];
};

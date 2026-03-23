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
  { id: 'mbti', title: 'MBTI人格测试', questions: 28, participants: '12.3万', color: 'bg-blue-500' },
  { id: 'enneagram', title: '九型人格测试', questions: 36, participants: '9.8万', color: 'bg-purple-500' },
  { id: 'love', title: '亲密关系依恋', questions: 12, participants: '8.7万', color: 'bg-rose-500' },
  { id: 'disc', title: 'DISC性格测试', questions: 24, participants: '7.5万', color: 'bg-yellow-500' },
  { id: 'eq', title: '情商测试', questions: 20, participants: '6.2万', color: 'bg-green-500' },
  { id: 'career', title: '职业兴趣测试', questions: 30, participants: '10.1万', color: 'bg-indigo-500' },
  { id: 'city', title: '梦想城市匹配测试', questions: 25, participants: '15.8万', color: 'bg-emerald-500' }, // Updated city quiz to 25 questions
];

export const getQuizDef = (slug: string): QuizDefinition | undefined => {
  return quizRegistry[slug];
};

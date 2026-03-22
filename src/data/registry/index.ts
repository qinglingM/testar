import { mbtiQuiz } from '../quizzes/mbti';
import { enneagramQuiz } from '../quizzes/enneagram';
import { attachmentQuiz } from '../quizzes/attachment';
import { discQuiz } from '../quizzes/disc';
import { eqQuiz } from '../quizzes/eq';
import { careerQuiz } from '../quizzes/career';
import { QuizDefinition } from '../quiz-schema';

// Central registry for all available quizzes
export const quizRegistry: Record<string, QuizDefinition> = {
  mbti: mbtiQuiz,
  enneagram: enneagramQuiz,
  love: attachmentQuiz,
  disc: discQuiz,
  eq: eqQuiz,
  career: careerQuiz
};

export const getQuizDef = (slug: string): QuizDefinition | undefined => {
  return quizRegistry[slug];
};

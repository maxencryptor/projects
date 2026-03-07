import { QUESTION_CATEGORIES } from './constants';

export const getRandomLetter = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return letters[Math.floor(Math.random() * letters.length)];
};

export const getRandomCategory = () => {
  return QUESTION_CATEGORIES[Math.floor(Math.random() * QUESTION_CATEGORIES.length)];
};

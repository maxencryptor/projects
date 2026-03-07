import { CATEGORIES } from './constants';

export const getRandomLetter = () => {
  const letters = 'ABCDEFGHIJKLMNOPRSTUVWZ';
  return letters[Math.floor(Math.random() * letters.length)];
};

export const buildRoundCategory = () => {
  const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
  const letter = getRandomLetter();

  if (category.includes('Buchstabe')) {
    return `${category}${letter}`;
  }

  return category;
};

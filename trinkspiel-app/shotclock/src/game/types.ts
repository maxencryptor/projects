export type GameMode = 'menu' | 'setup' | 'game';

export type Phase = 'playing' | 'reward' | 'result';

export type Player = {
  id: string;
  name: string;
  totalHits: number;
  totalMisses: number;
  drinksGiven: number;
};

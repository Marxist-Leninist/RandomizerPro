/**
 * Type definitions for the app
 */

export type RandomizerType =
  | 'number'
  | 'dice'
  | 'coin'
  | 'picker'
  | 'color'
  | 'decision';

export interface HistoryEntry {
  id: string;
  type: RandomizerType;
  result: string;
  details?: string;
  timestamp: number;
}

export interface CustomList {
  id: string;
  name: string;
  items: string[];
  createdAt: number;
  updatedAt: number;
}

export interface FavoriteColor {
  id: string;
  hex: string;
  rgb: { r: number; g: number; b: number };
  timestamp: number;
}

export interface CoinStats {
  heads: number;
  tails: number;
}

export interface AppSettings {
  hapticFeedback: boolean;
  soundEffects: boolean;
  theme: 'light' | 'dark' | 'system';
}

export type DiceType = 4 | 6 | 8 | 10 | 12 | 20;

export interface DiceRoll {
  sides: DiceType;
  results: number[];
  total: number;
}
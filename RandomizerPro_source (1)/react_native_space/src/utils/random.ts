/**
 * Random number generation utilities
 */

export const generateRandomNumber = (min: number, max: number, decimalPlaces: number = 0): number => {
  if (decimalPlaces === 0) {
    const minNum = Math.ceil(min);
    const maxNum = Math.floor(max);
    return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
  }
  
  const random = Math.random() * (max - min) + min;
  return Number(random.toFixed(decimalPlaces));
};

export const rollDice = (sides: number): number => {
  return generateRandomNumber(1, sides);
};

export const rollMultipleDice = (sides: number, count: number): number[] => {
  return Array.from({ length: count }, () => rollDice(sides));
};

export const flipCoin = (): 'heads' | 'tails' => {
  return Math.random() < 0.5 ? 'heads' : 'tails';
};

export const generateRandomColor = (): { hex: string; rgb: { r: number; g: number; b: number } } => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  return { hex, rgb: { r, g, b } };
};

export const makeDecision = (options: string[]): string => {
  if (options.length === 0) return '';
  const index = Math.floor(Math.random() * options.length);
  return options[index];
};

export const pickRandomItem = (items: string[]): string | null => {
  if (items.length === 0) return null;
  const index = Math.floor(Math.random() * items.length);
  return items[index];
};
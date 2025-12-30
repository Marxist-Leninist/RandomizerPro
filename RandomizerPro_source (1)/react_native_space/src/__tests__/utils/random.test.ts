import {
  generateRandomNumber,
  rollDice,
  rollMultipleDice,
  flipCoin,
  generateRandomColor,
  makeDecision,
  pickRandomItem,
} from '../../utils/random';

describe('Random Utilities', () => {
  describe('generateRandomNumber', () => {
    it('should generate number within range', () => {
      const min = 1;
      const max = 10;
      for (let i = 0; i < 100; i++) {
        const result = generateRandomNumber(min, max);
        expect(result).toBeGreaterThanOrEqual(min);
        expect(result).toBeLessThanOrEqual(max);
      }
    });

    it('should work with negative numbers', () => {
      const min = -10;
      const max = -1;
      for (let i = 0; i < 50; i++) {
        const result = generateRandomNumber(min, max);
        expect(result).toBeGreaterThanOrEqual(min);
        expect(result).toBeLessThanOrEqual(max);
      }
    });
  });

  describe('rollDice', () => {
    it('should roll within dice range', () => {
      const sides = 6;
      for (let i = 0; i < 50; i++) {
        const result = rollDice(sides);
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(sides);
      }
    });
  });

  describe('rollMultipleDice', () => {
    it('should roll correct number of dice', () => {
      const sides = 6;
      const count = 5;
      const results = rollMultipleDice(sides, count);
      expect(results).toHaveLength(count);
      results.forEach((result) => {
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(sides);
      });
    });
  });

  describe('flipCoin', () => {
    it('should return heads or tails', () => {
      for (let i = 0; i < 50; i++) {
        const result = flipCoin();
        expect(['heads', 'tails']).toContain(result);
      }
    });
  });

  describe('generateRandomColor', () => {
    it('should generate valid color object', () => {
      const color = generateRandomColor();
      expect(color).toHaveProperty('hex');
      expect(color).toHaveProperty('rgb');
      expect(color.hex).toMatch(/^#[0-9a-f]{6}$/);
      expect(color.rgb.r).toBeGreaterThanOrEqual(0);
      expect(color.rgb.r).toBeLessThanOrEqual(255);
      expect(color.rgb.g).toBeGreaterThanOrEqual(0);
      expect(color.rgb.g).toBeLessThanOrEqual(255);
      expect(color.rgb.b).toBeGreaterThanOrEqual(0);
      expect(color.rgb.b).toBeLessThanOrEqual(255);
    });
  });

  describe('makeDecision', () => {
    it('should return one of the options', () => {
      const options = ['Yes', 'No', 'Maybe'];
      for (let i = 0; i < 30; i++) {
        const result = makeDecision(options);
        expect(options).toContain(result);
      }
    });

    it('should return empty string for empty array', () => {
      const result = makeDecision([]);
      expect(result).toBe('');
    });
  });

  describe('pickRandomItem', () => {
    it('should pick item from list', () => {
      const items = ['Apple', 'Banana', 'Cherry'];
      for (let i = 0; i < 30; i++) {
        const result = pickRandomItem(items);
        expect(items).toContain(result);
      }
    });

    it('should return null for empty array', () => {
      const result = pickRandomItem([]);
      expect(result).toBeNull();
    });
  });
});
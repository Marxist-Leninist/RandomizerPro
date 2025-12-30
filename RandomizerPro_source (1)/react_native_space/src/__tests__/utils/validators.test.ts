import { validateNumberRange, validateListName, validateItem } from '../../utils/validators';

describe('Validators', () => {
  describe('validateNumberRange', () => {
    it('should validate valid range', () => {
      const result = validateNumberRange(1, 100);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject when min > max', () => {
      const result = validateNumberRange(100, 1);
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject NaN values', () => {
      const result = validateNumberRange(NaN, 100);
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should accept negative ranges', () => {
      const result = validateNumberRange(-10, -1);
      expect(result.valid).toBe(true);
    });
  });

  describe('validateListName', () => {
    it('should validate valid list name', () => {
      const result = validateListName('My List');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject empty string', () => {
      const result = validateListName('');
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject whitespace only', () => {
      const result = validateListName('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject names longer than 50 characters', () => {
      const result = validateListName('a'.repeat(51));
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('validateItem', () => {
    it('should validate valid item', () => {
      const result = validateItem('Item 1');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject empty string', () => {
      const result = validateItem('');
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject items longer than 100 characters', () => {
      const result = validateItem('a'.repeat(101));
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
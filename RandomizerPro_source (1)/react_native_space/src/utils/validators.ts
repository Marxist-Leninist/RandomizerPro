/**
 * Input validation utilities
 */

export const validateNumberRange = (min: number, max: number): { valid: boolean; error?: string } => {
  if (isNaN(min) || isNaN(max)) {
    return { valid: false, error: 'Please enter valid numbers' };
  }
  if (min > max) {
    return { valid: false, error: 'Minimum must be less than or equal to maximum' };
  }
  return { valid: true };
};

export const validateListName = (name: string): { valid: boolean; error?: string } => {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'List name cannot be empty' };
  }
  if (name.length > 50) {
    return { valid: false, error: 'List name must be 50 characters or less' };
  }
  return { valid: true };
};

export const validateItem = (item: string): { valid: boolean; error?: string } => {
  if (!item || item.trim().length === 0) {
    return { valid: false, error: 'Item cannot be empty' };
  }
  if (item.length > 100) {
    return { valid: false, error: 'Item must be 100 characters or less' };
  }
  return { valid: true };
};
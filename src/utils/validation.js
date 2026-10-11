/**
 * Validation Utility
 * 
 * Common validation functions for form inputs and data.
 * Each function returns { valid: boolean, message?: string }.
 * 
 * Usage:
 *   import { validateEmail, validateRequired } from '@/utils/validation';
 * 
 *   const result = validateEmail('user@example.com');
 *   if (!result.valid) console.log(result.message);
 */

/**
 * Check if a value is non-empty
 * @param {any} value
 * @param {string} fieldName - Used in error message
 * @returns {{ valid: boolean, message?: string }}
 */
export function validateRequired(value, fieldName = 'This field') {
  if (value === null || value === undefined || String(value).trim() === '') {
    return { valid: false, message: `${fieldName} is required` };
  }
  return { valid: true };
}

/**
 * Validate email format
 * @param {string} email
 * @returns {{ valid: boolean, message?: string }}
 */
export function validateEmail(email) {
  const req = validateRequired(email, 'Email');
  if (!req.valid) return req;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Please enter a valid email address' };
  }
  return { valid: true };
}

/**
 * Validate minimum length
 * @param {string} value
 * @param {number} min
 * @param {string} fieldName
 * @returns {{ valid: boolean, message?: string }}
 */
export function validateMinLength(value, min, fieldName = 'This field') {
  if (!value || value.length < min) {
    return { valid: false, message: `${fieldName} must be at least ${min} characters` };
  }
  return { valid: true };
}

/**
 * Validate maximum length
 * @param {string} value
 * @param {number} max
 * @param {string} fieldName
 * @returns {{ valid: boolean, message?: string }}
 */
export function validateMaxLength(value, max, fieldName = 'This field') {
  if (value && value.length > max) {
    return { valid: false, message: `${fieldName} must be at most ${max} characters` };
  }
  return { valid: true };
}

/**
 * Validate a URL
 * @param {string} url
 * @returns {{ valid: boolean, message?: string }}
 */
export function validateUrl(url) {
  const req = validateRequired(url, 'URL');
  if (!req.valid) return req;

  try {
    new URL(url);
    return { valid: true };
  } catch {
    return { valid: false, message: 'Please enter a valid URL' };
  }
}

/**
 * Validate a number is within range
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @param {string} fieldName
 * @returns {{ valid: boolean, message?: string }}
 */
export function validateRange(value, min, max, fieldName = 'Value') {
  const num = Number(value);
  if (isNaN(num)) {
    return { valid: false, message: `${fieldName} must be a number` };
  }
  if (num < min || num > max) {
    return { valid: false, message: `${fieldName} must be between ${min} and ${max}` };
  }
  return { valid: true };
}

/**
 * Run multiple validators on a value
 * Returns the first failing result, or { valid: true }
 * @param {any} value
 * @param {Array<(value: any) => { valid: boolean, message?: string }>} validators
 * @returns {{ valid: boolean, message?: string }}
 */
export function validate(value, validators) {
  for (const validator of validators) {
    const result = validator(value);
    if (!result.valid) return result;
  }
  return { valid: true };
}

export default {
  validateRequired,
  validateEmail,
  validateMinLength,
  validateMaxLength,
  validateUrl,
  validateRange,
  validate,
};

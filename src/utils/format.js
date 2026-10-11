/**
 * Formatting Utility
 * 
 * Common formatting functions for dates, numbers, strings, and file sizes.
 * 
 * Usage:
 *   import { formatDate, formatNumber, formatFileSize } from '@/utils/format';
 * 
 *   formatDate(new Date());              // 'Oct 11, 2025'
 *   formatDate(new Date(), 'short');      // '10/11/25'
 *   formatNumber(1234567);                // '1,234,567'
 *   formatCurrency(29.99);               // '$29.99'
 *   formatFileSize(1048576);              // '1.0 MB'
 *   truncate('Long text...', 10);         // 'Long te...'
 *   capitalize('hello world');            // 'Hello world'
 */

/**
 * Format a date
 * @param {Date|string|number} date
 * @param {'short'|'medium'|'long'|'relative'} style
 * @returns {string}
 */
export function formatDate(date, style = 'medium') {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  if (style === 'relative') {
    return formatRelativeTime(d);
  }

  const options = {
    short: { year: '2-digit', month: 'numeric', day: 'numeric' },
    medium: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' },
  };

  return d.toLocaleDateString(undefined, options[style] || options.medium);
}

/**
 * Format a date as relative time (e.g., "2 hours ago", "in 3 days")
 * @param {Date} date
 * @returns {string}
 */
export function formatRelativeTime(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 0) {
    // Future dates
    const absSec = Math.abs(diffSec);
    const absMin = Math.floor(absSec / 60);
    const absHour = Math.floor(absMin / 60);
    const absDay = Math.floor(absHour / 24);
    if (absDay > 0) return `in ${absDay} day${absDay > 1 ? 's' : ''}`;
    if (absHour > 0) return `in ${absHour} hour${absHour > 1 ? 's' : ''}`;
    if (absMin > 0) return `in ${absMin} minute${absMin > 1 ? 's' : ''}`;
    return 'just now';
  }

  if (diffDay > 30) return formatDate(date, 'medium');
  if (diffDay > 0) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  if (diffHour > 0) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  if (diffMin > 0) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  return 'just now';
}

/**
 * Format a number with locale-aware separators
 * @param {number} num
 * @param {number} decimals - Number of decimal places
 * @returns {string}
 */
export function formatNumber(num, decimals = 0) {
  if (num === null || num === undefined || isNaN(num)) return '';
  return Number(num).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format a number as currency
 * @param {number} amount
 * @param {string} currency - ISO 4217 currency code (default: 'USD')
 * @returns {string}
 */
export function formatCurrency(amount, currency = 'USD') {
  if (amount === null || amount === undefined || isNaN(amount)) return '';
  return Number(amount).toLocaleString(undefined, {
    style: 'currency',
    currency,
  });
}

/**
 * Format bytes into human-readable file size
 * @param {number} bytes
 * @param {number} decimals
 * @returns {string}
 */
export function formatFileSize(bytes, decimals = 1) {
  if (bytes === 0) return '0 B';
  if (!bytes || isNaN(bytes)) return '';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/**
 * Truncate a string to a maximum length
 * @param {string} str
 * @param {number} maxLength
 * @param {string} suffix
 * @returns {string}
 */
export function truncate(str, maxLength, suffix = '...') {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Capitalize the first letter of a string
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert a string to slug format
 * @param {string} str
 * @returns {string}
 */
export function slugify(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default {
  formatDate,
  formatRelativeTime,
  formatNumber,
  formatCurrency,
  formatFileSize,
  truncate,
  capitalize,
  slugify,
};

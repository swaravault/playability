import { useState, useEffect } from 'react';

/**
 * useDebounce Hook
 * 
 * Debounces a value by a specified delay. Useful for search inputs,
 * API calls, and any value that changes rapidly.
 * 
 * Usage:
 *   const [searchTerm, setSearchTerm] = useState('');
 *   const debouncedSearch = useDebounce(searchTerm, 300);
 * 
 *   useEffect(() => {
 *     // This runs only after the user stops typing for 300ms
 *     fetchResults(debouncedSearch);
 *   }, [debouncedSearch]);
 * 
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default: 300)
 * @returns {any} The debounced value
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;

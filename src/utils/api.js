/**
 * API Client Utility
 * 
 * A lightweight fetch wrapper with consistent error handling,
 * automatic JSON parsing, and configurable base URL.
 * 
 * Usage:
 *   import api from '@/utils/api';
 * 
 *   // GET request
 *   const users = await api.get('/users');
 * 
 *   // POST request
 *   const newUser = await api.post('/users', { name: 'John' });
 * 
 *   // With custom headers
 *   const data = await api.get('/protected', {
 *     headers: { Authorization: `Bearer ${token}` },
 *   });
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Custom API error with status code and response body
 */
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Core fetch wrapper
 * @param {string} endpoint - API endpoint (appended to BASE_URL)
 * @param {RequestInit & { params?: Record<string, string> }} options - Fetch options + query params
 * @returns {Promise<any>} Parsed JSON response
 */
async function request(endpoint, options = {}) {
  const { params, headers: customHeaders, ...fetchOptions } = options;

  // Build URL with query parameters
  let url = `${BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  // Default headers
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  // Handle non-JSON responses
  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw new ApiError(
      data?.message || data?.error || `Request failed with status ${response.status}`,
      response.status,
      data
    );
  }

  return data;
}

const api = {
  /**
   * GET request
   * @param {string} endpoint
   * @param {object} options - { params, headers, ... }
   */
  get(endpoint, options = {}) {
    return request(endpoint, { ...options, method: 'GET' });
  },

  /**
   * POST request
   * @param {string} endpoint
   * @param {any} body - Request body (will be JSON.stringify'd)
   * @param {object} options
   */
  post(endpoint, body, options = {}) {
    return request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  /**
   * PUT request
   * @param {string} endpoint
   * @param {any} body
   * @param {object} options
   */
  put(endpoint, body, options = {}) {
    return request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  /**
   * PATCH request
   * @param {string} endpoint
   * @param {any} body
   * @param {object} options
   */
  patch(endpoint, body, options = {}) {
    return request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  /**
   * DELETE request
   * @param {string} endpoint
   * @param {object} options
   */
  delete(endpoint, options = {}) {
    return request(endpoint, { ...options, method: 'DELETE' });
  },
};

export default api;

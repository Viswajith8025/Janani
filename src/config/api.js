/**
 * src/config/api.js
 * Shared fetch utility for all backend API calls.
 * Base URL controlled by VITE_API_URL env var.
 */

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

/**
 * apiFetch — typed wrapper around fetch.
 * Throws an Error with the server's message on non-2xx responses.
 *
 * @param {string} endpoint  — e.g. '/booking'
 * @param {RequestInit} options
 * @returns {Promise<{success, message, data, meta}>}
 */
export const apiFetch = async (endpoint, options = {}) => {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    const err = new Error(data.message || 'Something went wrong. Please try again.');
    err.status = res.status;
    err.data   = data;
    throw err;
  }

  return data;
};

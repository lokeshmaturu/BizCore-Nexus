/**
 * Central Axios Instance with Interceptors
 * Configured for HTTP-only cookies, token injection, and standardized error normalization.
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for sending/receiving HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach token if stored in localStorage fallback
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bizcore_token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Standardize error responses and handle 401 unauthenticated states
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;

    if (status === 401) {
      // Clear client storage if unauthorized
      localStorage.removeItem('bizcore_token');
      localStorage.removeItem('bizcore_user');
      
      // Dispatch custom event for app-level state sync
      window.dispatchEvent(new CustomEvent('bizcore:unauthorized'));
    }

    // Extract standardized message
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'A network error occurred. Please verify your connection.';

    // Attach normalized message to error object
    error.customMessage = message;
    error.validationErrors = error.response?.data?.errors || null;

    return Promise.reject(error);
  }
);

export default api;

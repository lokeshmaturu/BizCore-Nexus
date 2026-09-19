/**
 * Authentication Service
 * Communicates with backend authentication endpoints.
 */

import api from './api';

export const authService = {
  /**
   * Register a new enterprise user
   */
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.data?.token) {
      localStorage.setItem('bizcore_token', response.data.token);
    }
    if (response.data?.user) {
      localStorage.setItem('bizcore_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  /**
   * Log in user with credentials
   */
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.data?.token) {
      localStorage.setItem('bizcore_token', response.data.token);
    }
    if (response.data?.user) {
      localStorage.setItem('bizcore_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  /**
   * Log out currently authenticated user
   */
  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('bizcore_token');
      localStorage.removeItem('bizcore_user');
    }
  },

  /**
   * Fetch current user profile
   */
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    if (response.data?.data) {
      localStorage.setItem('bizcore_user', JSON.stringify(response.data.data));
    }
    return response.data?.data;
  },

  /**
   * Request password reset link (UI placeholder in Phase 1)
   */
  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },
};

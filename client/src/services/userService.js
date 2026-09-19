/**
 * User Service
 * Administrative and profile user management APIs.
 */

import api from './api';

export const userService = {
  /**
   * Fetch paginated users list
   */
  async getUsers(params = {}) {
    const response = await api.get('/users', { params });
    return response.data;
  },

  /**
   * Fetch single user details by ID
   */
  async getUserById(id) {
    const response = await api.get(`/users/${id}`);
    return response.data?.data;
  },

  /**
   * Update user details
   */
  async updateUser(id, updateData) {
    const response = await api.patch(`/users/${id}`, updateData);
    return response.data?.data;
  },

  /**
   * Delete user by ID (SuperAdmin only)
   */
  async deleteUser(id) {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

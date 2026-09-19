/**
 * Human Resources Service
 */

import api from './api';

export const hrService = {
  async getEmployees(params = {}) {
    const response = await api.get('/hr/employees', { params });
    return response.data;
  },

  async getEmployeeById(id) {
    const response = await api.get(`/hr/employees/${id}`);
    return response.data?.data;
  },

  async createEmployee(employeeData) {
    const response = await api.post('/hr/employees', employeeData);
    return response.data?.data;
  },

  async updateEmployee(id, employeeData) {
    const response = await api.patch(`/hr/employees/${id}`, employeeData);
    return response.data?.data;
  },

  async getLeaves(params = {}) {
    const response = await api.get('/hr/leaves', { params });
    return response.data;
  },

  async createLeave(leaveData) {
    const response = await api.post('/hr/leaves', leaveData);
    return response.data?.data;
  },

  async updateLeaveStatus(id, statusData) {
    const response = await api.patch(`/hr/leaves/${id}/status`, statusData);
    return response.data?.data;
  },
};

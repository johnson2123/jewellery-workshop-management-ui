import apiClient from './apiClient';

export const userManagementApi = {
  getUsers: async (params = {}) => {
    return await apiClient.get('/UserManagement', { params });
  },

  getUserById: async (id) => {
    return await apiClient.get(`/UserManagement/${id}`);
  },

  getUserByEmployeeId: async (employeeId) => {
    return await apiClient.get(`/UserManagement/employee/${employeeId}`);
  },

  createUser: async (data) => {
    return await apiClient.post('/UserManagement', data, {
      successToast: 'User account created successfully.',
    });
  },

  updateUser: async (id, data) => {
    return await apiClient.put(`/UserManagement/${id}`, data, {
      successToast: 'User parameters updated successfully.',
    });
  },

  toggleStatus: async (id, isActive) => {
    const statusText = isActive ? 'activated' : 'locked';
    return await apiClient.patch(`/UserManagement/${id}/status`, { isActive }, {
      successToast: `User account ${statusText} successfully.`,
    });
  }
};

export default userManagementApi;
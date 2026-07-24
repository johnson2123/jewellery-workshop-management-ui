import apiClient from './apiClient';

/**
 * Process Management API Service
 */
export const processApi = {
  /**
   * Get all processes
   * GET /api/v1/ProcessManagement
   */
  getAllProcesses: async () => {
    return await apiClient.get('/ProcessManagement');
  },

  /**
   * Get single process by code
   * GET /api/v1/ProcessManagement/{code}
   */
  getProcessByCode: async (code) => {
    return await apiClient.get(`/ProcessManagement/${code}`);
  },

  /**
   * Create a new process
   * POST /api/v1/ProcessManagement
   * @param {Object} data - { processCode: number, processName: string, activityCode: number }
   */
  createProcess: async (data) => {
    return await apiClient.post('/ProcessManagement', data, {
      successToast: 'Process created successfully.',
    });
  },

  /**
   * Update an existing process
   * PUT /api/v1/ProcessManagement/{code}
   * @param {number} code - Process Code
   * @param {Object} data - { processCode: number, processName: string, activityCode: number }
   */
  updateProcess: async (code, data) => {
    return await apiClient.put(`/ProcessManagement/${code}`, data, {
      successToast: 'Process updated successfully.',
    });
  },

  /**
   * Delete a process
   * DELETE /api/v1/ProcessManagement/{code}
   * @param {number} code - Process Code
   */
  deleteProcess: async (code) => {
    return await apiClient.delete(`/ProcessManagement/${code}`, {
      successToast: 'Process deleted successfully.',
    });
  },
};

export default processApi;
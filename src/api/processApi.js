import apiClient from './apiClient';

/**
 * Process Management API Service
 */
export const processApi = {
  /**
   * Get unpaginated processes list (for dropdown options and lookups)
   * GET /api/v1/ProcessManagement/options
   */
  getAllProcesses: async () => {
    return await apiClient.get('/ProcessManagement/options');
  },

  /**
   * Get paginated processes with search and filters
   * GET /api/v1/ProcessManagement?pageNumber={page}&pageSize={size}&searchTerm={search}
   * @param {Object} params - { pageNumber: number, pageSize: number, searchTerm: string }
   */
  getPagedProcesses: async (params) => {
    return await apiClient.get('/ProcessManagement', { params });
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
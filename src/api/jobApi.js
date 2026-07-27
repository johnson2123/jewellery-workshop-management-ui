import apiClient from './apiClient';

/**
 * Job Management API Service
 */
export const jobApi = {
  /**
   * Get unpaginated job orders list (for dropdown options and lookups)
   * GET /api/v1/JobManagement/options
   */
  getAllJobs: async () => {
    return await apiClient.get('/JobManagement/options');
  },

  /**
   * Get paginated job orders with search and filters
   * GET /api/v1/JobManagement?pageNumber={page}&pageSize={size}&searchTerm={search}&sortBy={field}&isDescending={bool}
   * @param {Object} params - { pageNumber: number, pageSize: number, searchTerm: string, sortBy: string, isDescending: boolean }
   */
  getPagedJobs: async (params) => {
    return await apiClient.get('/JobManagement', { params });
  },

  /**
   * Get single job by code
   * GET /api/v1/JobManagement/{jobCode}
   */
  getJobByCode: async (jobCode) => {
    return await apiClient.get(`/JobManagement/${jobCode}`);
  },

  /**
   * Create a new job order
   * POST /api/v1/JobManagement
   * @param {Object} data - { jobCode: number, jobName: string }
   */
  createJob: async (data) => {
    return await apiClient.post('/JobManagement', data, {
      successToast: 'Job order created successfully.',
    });
  },

  /**
   * Update an existing job order
   * PUT /api/v1/JobManagement/{jobCode}
   * @param {number} jobCode - Job Code
   * @param {Object} data - { jobCode: number, jobName: string }
   */
  updateJob: async (jobCode, data) => {
    return await apiClient.put(`/JobManagement/${jobCode}`, data, {
      successToast: 'Job order updated successfully.',
    });
  },

  /**
   * Delete a job order
   * DELETE /api/v1/JobManagement/{jobCode}
   * @param {number} jobCode - Job Code
   */
  deleteJob: async (jobCode) => {
    return await apiClient.delete(`/JobManagement/${jobCode}`, {
      successToast: 'Job order deleted successfully.',
    });
  },
};

export default jobApi;
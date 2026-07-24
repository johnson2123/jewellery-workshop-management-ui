import apiClient from './apiClient';

/**
 * Job Management API Service
 */
export const jobApi = {
  /**
   * Get all jobs
   * GET /api/v1/JobManagement
   */
  getAllJobs: async () => {
    return await apiClient.get('/JobManagement');
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
import apiClient from './apiClient';

/**
 * Activity Management API Service
 */
export const activityApi = {
  /**
   * Get unpaginated activities list (for dropdown options and lookups)
   * GET /api/v1/ActivityManagement/options
   */
  getAllActivities: async () => {
    return await apiClient.get('/ActivityManagement/options');
  },

  /**
   * Get paginated activities with search and filters
   * GET /api/v1/ActivityManagement?pageNumber={page}&pageSize={size}&searchTerm={search}
   * @param {Object} params - { pageNumber: number, pageSize: number, searchTerm: string }
   */
  getPagedActivities: async (params) => {
    return await apiClient.get('/ActivityManagement', { params });
  },

  /**
   * Get single activity by code
   * GET /api/v1/ActivityManagement/{code}
   */
  getActivityByCode: async (code) => {
    return await apiClient.get(`/ActivityManagement/${code}`);
  },

  /**
   * Create a new activity
   * POST /api/v1/ActivityManagement
   * @param {Object} data - { activityCode: number, activityName: string }
   */
  createActivity: async (data) => {
    return await apiClient.post('/ActivityManagement', data, {
      successToast: 'Activity created successfully.',
    });
  },

  /**
   * Update an existing activity
   * PUT /api/v1/ActivityManagement/{code}
   * @param {number} code - Activity Code
   * @param {Object} data - { activityCode: number, activityName: string }
   */
  updateActivity: async (code, data) => {
    return await apiClient.put(`/ActivityManagement/${code}`, data, {
      successToast: 'Activity updated successfully.',
    });
  },

  /**
   * Delete an activity
   * DELETE /api/v1/ActivityManagement/{code}
   * @param {number} code - Activity Code
   */
  deleteActivity: async (code) => {
    return await apiClient.delete(`/ActivityManagement/${code}`, {
      successToast: 'Activity deleted successfully.',
    });
  },
};

export default activityApi;
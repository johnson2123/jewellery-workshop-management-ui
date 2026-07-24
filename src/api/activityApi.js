import apiClient from './apiClient';

/**
 * Activity Management API Service
 */
export const activityApi = {
  /**
   * Get all activities
   * GET /api/v1/ActivityManagement
   */
  getAllActivities: async () => {
    return await apiClient.get('/ActivityManagement');
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
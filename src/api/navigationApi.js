import apiClient from './apiClient';

/**
 * Fetches authorized navigation menu items for the current authenticated user.
 * Backend Endpoint: GET /v1/navigation/my-menu (BaseURL already contains /api/v1)
 */
export const fetchMyMenu = async () => {
  // apiClient directly returns the unwrapped data array from C# ApiResponse<T>
  const data = await apiClient.get('/navigation/my-menu');
  return data || [];
};
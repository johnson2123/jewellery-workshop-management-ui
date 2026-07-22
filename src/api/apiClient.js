import axios from 'axios';
import { getAccessToken, setAccessToken, clearAccessToken } from './tokenStore';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7199/api/v1';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 15000,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// 1. Request Interceptor: Attach Access Token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor: Handle API Unwrapping & Silent Refresh
apiClient.interceptors.response.use(
  (response) => {
    const apiResponse = response.data;

    // Unwrap C# ApiResponse<T> contract if present
    if (apiResponse && typeof apiResponse.isSuccess === 'boolean') {
      if (apiResponse.isSuccess) {
        return apiResponse.data;
      } else {
        const errorMessage =
          apiResponse.errors?.join(', ') || apiResponse.message || 'Operation failed.';
        const customError = new Error(errorMessage);
        customError.response = response;
        return Promise.reject(customError);
      }
    }

    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    const responseData = error.response?.data;
    const backendMessage =
      responseData?.errors?.join(', ') ||
      responseData?.message ||
      error.message ||
      'A network error occurred. Please try again.';

    // Check for 401 Unauthorized
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      const currentToken = getAccessToken();

      // Terminal conditions where we SHOULD NOT attempt /auth/refresh-token:
      // 1. Login fails
      // 2. The refresh request itself returned 401
      // 3. /auth/me failed on cold start AND we have no access token in memory to exchange
      const isLoginOrRefresh =
        originalRequest.url?.includes('/auth/refresh-token') ||
        originalRequest.url?.includes('/auth/login');
      
      const isColdStartMeWithoutToken =
        originalRequest.url?.includes('/auth/me') && !currentToken;

      if (isLoginOrRefresh || isColdStartMeWithoutToken) {
        clearAccessToken();
        
        // Dispatch auth:expired event only if it wasn't a standard login attempt
        if (!originalRequest.url?.includes('/auth/login')) {
          window.dispatchEvent(new Event('auth:expired'));
        }

        const authErrorMessage = isColdStartMeWithoutToken
          ? 'No active session found.'
          : 'Session expired. Please log in again.';

        return Promise.reject(new Error(authErrorMessage));
      }

      // If a refresh is already in progress, queue subsequent requests
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Perform token renewal using the HttpOnly cookie
        const refreshResponse = await axios.post(
          `${BASE_URL}/auth/refresh-token`,
          { expiredAccessToken: currentToken || '' },
          { withCredentials: true }
        );

        const rawData = refreshResponse.data;
        const newAuthData = rawData?.data || rawData;
        const newAccessToken = newAuthData?.accessToken;

        if (newAccessToken) {
          setAccessToken(newAccessToken);

          apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          processQueue(null, newAccessToken);

          // Re-execute the original request with the new token
          return apiClient(originalRequest);
        } else {
          throw new Error('No access token returned from refresh endpoint.');
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAccessToken();
        window.dispatchEvent(new Event('auth:expired'));
        return Promise.reject(new Error('Session expired. Please log in again.'));
      } finally {
        isRefreshing = false;
      }
    }

    const enhancedError = new Error(backendMessage);
    enhancedError.response = error.response;
    return Promise.reject(enhancedError);
  }
);

export default apiClient;
import axios from 'axios';
import { toast } from 'sonner';
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

// Request Interceptor: Attach Access Token
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

// Response Interceptor: Handle API Unwrapping, Toast Notifications & Silent Refresh
apiClient.interceptors.response.use(
  (response) => {
    const apiResponse = response.data;
    const config = response.config;

    // Unwrap C# ApiResponse<T> contract if present
    if (apiResponse && typeof apiResponse.isSuccess === 'boolean') {
      if (apiResponse.isSuccess) {
        // Success Toast Logic
        if (config.successToast) {
          const successMessage = typeof config.successToast === 'string'
            ? config.successToast
            : (apiResponse.message || 'Operation completed successfully.');
          toast.success(successMessage);
        }
        return apiResponse.data;
      } else {
        const errorMessage =
          apiResponse.errors?.join(', ') || apiResponse.message || 'Operation failed.';
        
        if (!config.skipErrorToast) {
          toast.error(errorMessage);
        }

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
    
    // Extract C# backend structured errors or fallback messages
    const backendMessage =
      responseData?.errors?.join(', ') ||
      responseData?.message ||
      error.message ||
      'A network error occurred. Please try again.';

    // Check for 401 Unauthorized
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      const currentToken = getAccessToken();

      // Convert URL to lowercase to prevent case-sensitivity mismatches (e.g. /Auth vs /auth)
      const requestUrlLower = originalRequest.url?.toLowerCase() || '';
      
      const isLoginRequest = requestUrlLower.includes('/auth/login');
      const isRefreshRequest = requestUrlLower.includes('/auth/refresh-token');
      const isColdStartMeWithoutToken = requestUrlLower.includes('/auth/me') && !currentToken;

      // 1. TERMINAL CONDITION: If actual login request returns 401, bubble up backend validation error
      if (isLoginRequest) {
        toast.error(backendMessage); // Added toast call to prevent bypassing notifications on early returns
        const loginError = new Error(backendMessage);
        loginError.response = error.response;
        return Promise.reject(loginError);
      }

      // 2. If token refresh or cold start session verification fails
      if (isRefreshRequest || isColdStartMeWithoutToken) {
        clearAccessToken();
        
        if (!isRefreshRequest) {
          window.dispatchEvent(new Event('auth:expired'));
        }

        const authErrorMessage = isColdStartMeWithoutToken
          ? 'No active session found.'
          : 'Session expired. Please log in again.';

        // Prevent showing toast alerts during initial cold-start session verification
        if (!isColdStartMeWithoutToken && !originalRequest.skipErrorToast) {
          toast.error(authErrorMessage);
        }

        return Promise.reject(new Error(authErrorMessage));
      }

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
          return apiClient(originalRequest);
        } else {
          throw new Error('No access token returned from refresh endpoint.');
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAccessToken();
        window.dispatchEvent(new Event('auth:expired'));
        
        if (!originalRequest.skipErrorToast) {
          toast.error('Session expired. Please log in again.');
        }
        return Promise.reject(new Error('Session expired. Please log in again.'));
      } finally {
        isRefreshing = false;
      }
    }

    // Default error auto-toasting unless explicitly bypassed
    if (originalRequest && !originalRequest.skipErrorToast) {
      toast.error(backendMessage);
    }

    const enhancedError = new Error(backendMessage);
    enhancedError.response = error.response;
    return Promise.reject(enhancedError);
  }
);

export default apiClient;
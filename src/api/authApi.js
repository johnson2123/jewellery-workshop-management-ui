
import apiClient from './apiClient';

/**
 * @typedef {Object} UserDto
 * @property {string} id
 * @property {string} userName
 * @property {string} email
 * @property {string[]} roles
 */

/**
 * @typedef {Object} AuthResponse
 * @property {string} accessToken
 * @property {string} accessTokenExpiresAtUtc
 * @property {UserDto} user
 */

/**
 * @typedef {Object} RegisterRequest
 * @property {string} email
 * @property {string} username
 * @property {string} password
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} [phoneNumber]
 * @property {string} role
 */

export const authApi = {
  /**
   * Logs in a user.
   * Triggers global Sonner toasts automatically on failure.
   * @param {{ email: string, password: string }} credentials
   * @returns {Promise<AuthResponse>}
   */
  login: (credentials) => {
    return apiClient.post('/auth/login', credentials, {
      successToast: 'Successfully logged in.'
    });
  },

  /**
   * Registers a new user account.
   * @param {RegisterRequest} userData
   * @returns {Promise<null>}
   */
  register: (userData) => {
    return apiClient.post('/auth/register', userData, {
      successToast: 'Account created successfully!'
    });
  },

  /**
   * Restores session state on page reload/cold start using HttpOnly cookie.
   * Mutes automatic error toast on 401s since cold starts without a session are expected.
   * @returns {Promise<AuthResponse>}
   */
  getCurrentSession: () => {
    return apiClient.get('/auth/me', {
      skipErrorToast: true
    });
  },

  /**
   * Refreshes the access token. Mutes automatic error toasting as failures are handled gracefully.
   * @param {string} expiredAccessToken
   * @returns {Promise<AuthResponse>}
   */
  refreshToken: (expiredAccessToken) => {
    return apiClient.post('/auth/refresh-token', { expiredAccessToken }, {
      skipErrorToast: true
    });
  },

  /**
   * Logs out the user and revokes the refresh token cookie.
   * @returns {Promise<null>}
   */
  logout: () => {
    return apiClient.post('/auth/logout', {}, {
      successToast: 'Logged out successfully.'
    });
  },

  /**
   * Updates the authenticated user's password.
   * Currently mocked for local testing. Switch comment lines below when C# endpoint is ready.
   * @param {{ currentPassword: string, newPassword: string }} data
   * @returns {Promise<null>}
   */
  changePassword: (data) => {
    // --- TEMPORARY MOCK FOR TESTING ---
    // Log the incoming data payload to satisfy ESLint and confirm values are correct
    console.log('Simulating API call with data:', data);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: 'Password changed successfully.' });
      }, 1000);
    });

    // --- UNCOMMENT THIS WHEN C# BACKEND IS READY ---
    // return apiClient.post('/auth/change-password', data, {
    //   successToast: 'Password changed successfully.'
    // });
  }
};

export default authApi;
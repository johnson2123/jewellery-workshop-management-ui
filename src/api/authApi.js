import apiClient from './apiClient';

/**
 * @typedef {Object} UserDto
 * @property {string} id - C# Guid represented as string
 * @property {string} userName
 * @property {string} email
 * @property {string[]} roles - IEnumerable<string> from C# backend
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

/**
 * Service for identity and authentication API endpoints.
 */
export const authApi = {
  /**
   * Logs in a user with email/username and password.
   * @param {{ email: string, password: string }} credentials
   * @returns {Promise<AuthResponse>}
   */
  login: (credentials) => {
    return apiClient.post('/auth/login', credentials);
  },

  /**
   * Registers a new user account in the system.
   * @param {RegisterRequest} userData
   * @returns {Promise<null>}
   */
  register: (userData) => {
    return apiClient.post('/auth/register', userData);
  },

  /**
   * Restores session state on page reload/cold start using HttpOnly cookie.
   * @returns {Promise<AuthResponse>}
   */
  getCurrentSession: () => {
    return apiClient.get('/auth/me');
  },

  /**
   * Refreshes the access token using the expired token and HttpOnly cookie during active usage.
   * @param {string} expiredAccessToken
   * @returns {Promise<AuthResponse>}
   */
  refreshToken: (expiredAccessToken) => {
    return apiClient.post('/auth/refresh-token', { expiredAccessToken });
  },

  /**
   * Logs out the user and revokes the refresh token cookie on backend.
   * @returns {Promise<null>}
   */
  logout: () => {
    return apiClient.post('/auth/logout');
  },
};

export default authApi;
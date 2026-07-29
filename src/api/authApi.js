import apiClient from './apiClient';

/**
 * @typedef {Object} UserDto
 * @property {string} id
 * @property {string} userName
 * @property {string} email
 * @property {string} [phoneNumber]
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

/**
 * @typedef {Object} VerifyOtpResponse
 * @property {string} actionToken
 * @property {string} target
 * @property {string} expiresAt
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
   * @param {{ currentPassword: string, newPassword: string, confirmPassword: string }} data
   * @returns {Promise<null>}
   */
  changePassword: (data) => {
    return apiClient.post('/auth/change-password', data, {
      successToast: 'Password updated successfully!'
    });
  },

  /**
   * Initiates the password recovery flow by sending a 6-digit OTP.
   * @param {string} email
   * @returns {Promise<null>}
   */
  forgotPassword: (email) => {
    return apiClient.post('/Auth/forgot-password', { email }, {
      successToast: 'Verification code sent to your email.'
    });
  },

  /**
   * Verifies the 6-digit OTP code and returns an ActionToken.
   * @param {{ target: string, otpCode: string, purpose?: string }} data
   * @returns {Promise<VerifyOtpResponse>}
   */
  verifyOtp: (data) => {
    return apiClient.post('/Auth/verify-otp', {
      purpose: 'ForgotPassword',
      ...data
    }, {
      successToast: 'Code verified successfully.'
    });
  },

  /**
   * Resets the user's password using the ActionToken issued during verification.
   * @param {{ target: string, actionToken: string, newPassword: string, confirmPassword: string }} data
   * @returns {Promise<{ isSuccess: boolean, message: string }>}
   */
  resetPassword: (data) => {
    return apiClient.post('/Auth/reset-password', data, {
      successToast: 'Password updated successfully!'
    });
  }
};

export default authApi;
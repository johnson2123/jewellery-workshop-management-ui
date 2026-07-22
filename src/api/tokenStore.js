/**
 * In-Memory Access Token Store
 * Keeps JWTs out of localStorage/sessionStorage to eliminate XSS token theft.
 */

let accessToken = null;

/**
 * Updates the current in-memory access token.
 * @param {string|null} token 
 */
export const setAccessToken = (token) => {
  accessToken = token;
};

/**
 * Retrieves the active access token.
 * @returns {string|null}
 */
export const getAccessToken = () => accessToken;

/**
 * Clears the access token from memory (used on logout/expiration).
 */
export const clearAccessToken = () => {
  accessToken = null;
};

/**
 * Helper to check if an in-memory token exists without reading its value.
 * @returns {boolean}
 */
export const hasAccessToken = () => Boolean(accessToken);
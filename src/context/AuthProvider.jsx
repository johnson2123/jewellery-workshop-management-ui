import { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { authApi } from '../api/authApi';
import { setAccessToken, clearAccessToken } from '../api/tokenStore';

let authInitializationPromise = null;

const initializeAuthOnce = () => {
  if (!authInitializationPromise) {
    authInitializationPromise = authApi.getCurrentSession();
  }

  return authInitializationPromise;
};

const resetAuthInitialization = () => {
  authInitializationPromise = null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const authData = await initializeAuthOnce();

        if (authData?.accessToken) {
          setAccessToken(authData.accessToken);

          if (isMounted) {
            setUser(authData.user);
          }
        } else {
          clearAccessToken();

          if (isMounted) {
            setUser(null);
          }
        }
      } catch {
        clearAccessToken();

        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const handleAuthExpired = () => {
      clearAccessToken();
      resetAuthInitialization();

      if (isMounted) {
        setUser(null);
      }
    };

    window.addEventListener('auth:expired', handleAuthExpired);

    initializeAuth();

    return () => {
      isMounted = false;
      window.removeEventListener('auth:expired', handleAuthExpired);
    };
  }, []);

  const login = useCallback(async (credentials) => {
    setIsLoading(true);

    try {
      const authData = await authApi.login(credentials);

      setAccessToken(authData.accessToken);
      setUser(authData.user);

      // Ensure future initialization uses this session
      resetAuthInitialization();

      return authData;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setIsLoading(true);

    try {
      return await authApi.register(userData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      await authApi.logout();
    } catch (error) {
      console.warn(
        'Server logout failed or network unreachable:',
        error.message
      );
    } finally {
      clearAccessToken();
      resetAuthInitialization();
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

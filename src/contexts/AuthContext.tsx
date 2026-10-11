import { useState, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { getAccessToken, clearTokens, getStoredUser, setStoredUser } from '../utils/token';
import { loginApi } from '../services/auth';
import toast from 'react-hot-toast';
import { DEV_LOGIN_EMAIL, DEV_LOGIN_PASSWORD } from '../config';
import { AuthContext } from '../hooks/useAuth';
import type { UserInfo } from '../hooks/useAuth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(Boolean(getAccessToken()));
  const [user, setUser] = useState<UserInfo | null>(() => {
    const stored = getStoredUser();
    if (stored) return stored;
    return getAccessToken() && DEV_LOGIN_EMAIL ? { email: DEV_LOGIN_EMAIL } : null;
  });

  useEffect(() => {
    // Listen for the emergency logout event from our API interceptor
    const handleForcedLogout = () => {
      setIsLoggedIn(false);
      setUser(null);
      toast.error('Session expired. Please log in again.');
    };

    window.addEventListener('auth:logout', handleForcedLogout);
    return () => window.removeEventListener('auth:logout', handleForcedLogout);
  }, []);

  const login = useCallback(async (email?: string, password?: string) => {
    const toastId = toast.loading('Authenticating...');
    try {
      const activeEmail = email || DEV_LOGIN_EMAIL;
      const activePassword = password || DEV_LOGIN_PASSWORD;

      const data = await loginApi({ email: activeEmail, password: activePassword });

      const userInfo: UserInfo = {
        email: activeEmail || '',
        customerId: data.customerId,
        name: data.name,
        role: data.role,
      };

      setIsLoggedIn(true);
      setUser(userInfo);
      setStoredUser(userInfo);

      toast.success(`Welcome back${data.name ? `, ${data.name}` : ''}!`, { id: toastId });
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please check credentials and try again.', { id: toastId });
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setIsLoggedIn(false);
    setUser(null);
    toast.success('Successfully logged out.');
  }, []);

  const contextValue = useMemo(() => ({
    isLoggedIn,
    user,
    login,
    logout
  }), [isLoggedIn, user, login, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

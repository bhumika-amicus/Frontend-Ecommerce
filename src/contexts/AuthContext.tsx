import { useState, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { getAccessToken, clearTokens } from '../utils/token';
import { devLogin } from '../services/auth';
import toast from 'react-hot-toast';
import { AuthContext } from '../hooks/useAuth';
import type { UserInfo } from '../hooks/useAuth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!getAccessToken());
  const [user, setUser] = useState<UserInfo | null>(null);

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

  const login = useCallback(async () => {
    const toastId = toast.loading('Authenticating...');
    try {
      // For this assignment, we use the devLogin which automatically 
      // fetches the real token using .env credentials
      await devLogin();

      setIsLoggedIn(true);
      // Mock setting user info based on successful login
      setUser({ email: 'shivamssrivastavaa@gmail.com' });

      toast.success('Successfully logged in!', { id: toastId });
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please try again.', { id: toastId });
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

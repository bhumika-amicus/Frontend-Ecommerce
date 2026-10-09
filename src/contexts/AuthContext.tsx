import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getAccessToken, clearTokens } from '../utils/token';
import { devLogin } from '../services/auth';
import toast from 'react-hot-toast';

interface UserInfo {
  email: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserInfo | null;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

  const login = async () => {
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
  };

  const logout = () => {
    clearTokens();
    setIsLoggedIn(false);
    setUser(null);
    toast.success('Successfully logged out.');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

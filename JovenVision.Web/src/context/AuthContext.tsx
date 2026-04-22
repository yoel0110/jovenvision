import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';

import type { AuthUser } from '../types';
import { getToken, setToken, removeToken } from '../utils/token';
import { authService } from '../services';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserFromToken = () => {
      const token = getToken();

      if (!token) {
        setLoading(false);
        return;
      }

      // Simple token existence check - let backend handle validation
      setUser({
        username: 'user', // Will be updated after first API call
        role: 'user',
        token,
        expiresAt: new Date(), // Will be updated after login
      });
      setLoading(false);
    };

    loadUserFromToken();
  }, []);

  const login = async (username: string, password: string) => {
    const response = await authService.login({ username, password });

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Error al iniciar sesión');
    }

    setToken(response.data.token);

    setUser({
      username: response.data.username,
      role: response.data.role,
      token: response.data.token,
      expiresAt: new Date(response.data.expiresAt),
    });
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('AuthContext must be used within AuthProvider');
  }

  return context;
};
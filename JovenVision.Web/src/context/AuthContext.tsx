import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';

import { jwtDecode } from 'jwt-decode';
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

interface JwtPayload {
  sub: string;
  role: string;
  exp: number;
  [key: string]: unknown;
}

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

      try {
        const decoded = jwtDecode<JwtPayload>(token);

        if (!decoded?.exp || !decoded?.sub || !decoded?.role) {
          removeToken();
          setLoading(false);
          return;
        }

        const expiresAt = new Date(decoded.exp * 1000);

        if (expiresAt <= new Date()) {
          removeToken();
          setLoading(false);
          return;
        }

        setUser({
          username: decoded.sub,
          role: decoded.role,
          token,
          expiresAt,
        });
      } catch {
        removeToken();
      } finally {
        setLoading(false);
      }
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
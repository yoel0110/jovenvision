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

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // Los claims estándar de .NET para ID, Role y Name
        const id = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || payload.nameid || 0;
        const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role || 'user';
        const username = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || payload.unique_name || 'user';

        setUser({
          id: parseInt(id, 10),
          username,
          role,
          token,
          expiresAt: new Date(payload.exp * 1000), 
        });
      } catch (e) {
        removeToken();
        setUser(null);
      }
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
      id: response.data.id,
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
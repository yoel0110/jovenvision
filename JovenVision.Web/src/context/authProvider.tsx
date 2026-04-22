import { createContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import type { AuthUser, JwtPayload, AuthContextType, AuthProviderProps } from './auth.types';
import { getToken, setToken, removeToken } from '../utils/token';
import { authService } from '../services';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
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

  const login = async (username: string, password: string): Promise<void> => {
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

  const logout = (): void => {
    removeToken();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };

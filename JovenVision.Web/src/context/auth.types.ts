import type { ReactNode } from 'react';

export interface AuthUser {
  username: string;
  role: string;
  token: string;
  expiresAt: Date;
}

export interface JwtPayload {
  sub: string;
  role: string;
  exp: number;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface AuthProviderProps {
  children: ReactNode;
}

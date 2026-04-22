import { useContext } from 'react';
import { AuthContext } from './authProvider';
import type { AuthContextType } from './auth.types';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('AuthContext must be used within AuthProvider');
  }

  return context;
};

import api from './api';
import type { ApiResponse, LoginRequest, LoginResponse } from '../types';

export const authService = {
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await api.post<ApiResponse<LoginResponse>>('/api/auth/login', data);
    return response.data;
  },
};

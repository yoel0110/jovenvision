import api from './api';
import type { ApiResponse, LoginRequest, LoginResponse } from '../types';

export const authService = {
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', data);
    return response.data;
  },
  me: async (): Promise<ApiResponse<any>> => {
    const response = await api.get<ApiResponse<any>>('/auth/me');
    return response.data;
  },
};

import { api } from './api';
import type { User, UserPayload } from '../types/user';
import type { ApiResponse } from '../types';

export const userService = {
  getUsers: async (): Promise<ApiResponse<User[]>> => {
    const response = await api.get<ApiResponse<User[]>>('/user');
    return response.data;
  },

  getUserById: async (id: number): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>(`/user/${id}`);
    return response.data;
  },

  createUser: async (data: UserPayload): Promise<ApiResponse<User>> => {
    const response = await api.post<ApiResponse<User>>('/user', data);
    return response.data;
  },

  updateUser: async (id: number, data: UserPayload): Promise<ApiResponse<string>> => {
    const response = await api.put<ApiResponse<string>>(`/user/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: number): Promise<ApiResponse<string>> => {
    const response = await api.delete<ApiResponse<string>>(`/user/${id}`);
    return response.data;
  }
};

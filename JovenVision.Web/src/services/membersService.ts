import api from './api';
import type { Member, MemberPayload, MemberFilters, MemberListResponse } from '../types/member';

export const membersService = {
  getMembers: async (params?: MemberFilters): Promise<MemberListResponse> => {
    const response = await api.get('/members', { params });
    return response.data.data;
  },

  getMemberById: async (id: number): Promise<Member> => {
    const response = await api.get(`/members/${id}`);
    return response.data.data;
  },

  createMember: async (data: MemberPayload): Promise<Member> => {
    const response = await api.post('/members', data);
    return response.data.data;
  },

  updateMember: async (id: number, data: MemberPayload): Promise<Member> => {
    const response = await api.put(`/members/${id}`, data);
    return response.data.data;
  },

  deleteMember: async (id: number): Promise<void> => {
    await api.delete(`/members/${id}`);
  }
};

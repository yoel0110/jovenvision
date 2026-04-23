import api from './api';
import type { Group, GroupPayload, GroupFilters, GroupListResponse } from '../types/group';

export const groupsService = {
  getGroups: async (params?: GroupFilters): Promise<GroupListResponse> => {
    const response = await api.get('/api/groups', { params });
    return response.data.data;
  },

  getGroupById: async (id: number): Promise<Group> => {
    const response = await api.get(`/api/groups/${id}`);
    return response.data.data;
  },

  createGroup: async (data: GroupPayload): Promise<Group> => {
    const response = await api.post('/api/groups', data);
    return response.data.data;
  },

  updateGroup: async (id: number, data: GroupPayload): Promise<Group> => {
    const response = await api.put(`/api/groups/${id}`, data);
    return response.data.data;
  },

  deleteGroup: async (id: number): Promise<void> => {
    await api.delete(`/api/groups/${id}`);
  },

  getMembers: async (id: number): Promise<any[]> => {
    const response = await api.get(`/api/groups/${id}/members`);
    return response.data.data;
  },

  addMember: async (groupId: number, memberId: number, role: string): Promise<void> => {
    await api.post(`/api/groups/${groupId}/members/${memberId}?role=${role}`);
  },

  removeMember: async (groupId: number, memberId: number): Promise<void> => {
    await api.delete(`/api/groups/${groupId}/members/${memberId}`);
  }
};

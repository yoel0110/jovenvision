import api from './api';
import type { Group, GroupPayload, GroupFilters, GroupListResponse } from '../types/group';

export const groupsService = {
  getGroups: async (params?: GroupFilters): Promise<GroupListResponse> => {
    const response = await api.get('/groups', { params });
    const data = response.data.data;
    
    if (Array.isArray(data)) {
      return {
        data: data,
        totalCount: data.length,
        page: params?.page || 1,
        pageSize: params?.pageSize || data.length
      };
    }
    
    return data;
  },

  getGroupById: async (id: number): Promise<Group> => {
    const response = await api.get(`/groups/${id}`);
    return response.data.data;
  },

  createGroup: async (data: GroupPayload): Promise<Group> => {
    const response = await api.post('/groups', data);
    return response.data.data;
  },

  updateGroup: async (id: number, data: GroupPayload): Promise<Group> => {
    const response = await api.put(`/groups/${id}`, data);
    return response.data.data;
  },

  deleteGroup: async (id: number): Promise<void> => {
    await api.delete(`/groups/${id}`);
  },

  getMembers: async (id: number): Promise<any[]> => {
    const response = await api.get(`/groups/${id}/members`);
    return response.data.data;
  },

  addMember: async (groupId: number, memberId: number, role: string): Promise<void> => {
    await api.post(`/groups/${groupId}/members/${memberId}?role=${role}`);
  },

  removeMember: async (groupId: number, memberId: number): Promise<void> => {
    await api.delete(`/groups/${groupId}/members/${memberId}`);
  }
};

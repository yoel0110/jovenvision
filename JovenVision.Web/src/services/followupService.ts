import { api } from './api';
import type { ApiResponse } from '../types/dashboard';
import type { FollowUp, FollowUpPayload } from '../types/followup';

export const followupService = {
  getFollowupsByMember: async (memberId: number): Promise<ApiResponse<FollowUp[]>> => {
    const response = await api.get<ApiResponse<any[]>>(`/tracking/member/${memberId}`);

    const mappedData = response.data.data.map(t => ({
      id: t.id,
      memberId: t.memberId,
      responsibleId: t.responsibleId,
      responsibleName: t.responsibleName,
      type: t.type as any,
      notes: t.description,
      status: t.status as any,
      date: t.date,
    }));

    return { ...response.data, data: mappedData };
  },

  getFollowups: async (params?: any): Promise<ApiResponse<FollowUp[]>> => {
    const response = await api.get<ApiResponse<any[]>>('/tracking', { params });

    const mappedData = response.data.data.map(t => ({
      id: t.id,
      memberId: t.memberId,
      responsibleId: t.responsibleId,
      responsibleName: t.responsibleName,
      type: t.type as any,
      notes: t.description,
      status: t.status as any,
      date: t.date,
    }));

    return { ...response.data, data: mappedData };
  },

  createFollowup: async (data: FollowUpPayload): Promise<ApiResponse<FollowUp>> => {
    const response = await api.post<ApiResponse<any>>('/tracking', data);
    const t = response.data.data;

    const mappedData = {
      id: t.id,
      memberId: t.memberId,
      responsibleId: t.responsibleId,
      responsibleName: t.responsibleName,
      type: t.type as any,
      notes: t.description,
      status: t.status as any,
      date: t.date,
    };

    return { ...response.data, data: mappedData };
  },

  updateFollowup: async (id: number, data: Partial<FollowUpPayload>): Promise<ApiResponse<string>> => {
    return (await api.put<ApiResponse<string>>(`/tracking/${id}`, data)).data;
  },

  deleteFollowup: async (id: number): Promise<ApiResponse<string>> => {
    return (await api.delete<ApiResponse<string>>(`/tracking/${id}`)).data;
  }
};

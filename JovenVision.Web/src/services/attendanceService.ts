import api from './api';
import type { Attendance, AttendancePayload } from '../types/attendance';

export const attendanceService = {
  getAll: async (): Promise<Attendance[]> => {
    const response = await api.get<any>('/attendance');
    return response.data.data;
  },

  getAttendanceByEvent: async (eventId: number): Promise<Attendance[]> => {
    const response = await api.get<any>(`/attendance/event/${eventId}`);
    return response.data.data;
  },

  getAttendanceByMember: async (memberId: number): Promise<Attendance[]> => {
    const response = await api.get<any>(`/attendance/member/${memberId}`);
    return response.data.data;
  },

  markAttendance: async (data: AttendancePayload): Promise<Attendance> => {
    const response = await api.post<any>('/attendance', data);
    return response.data.data;
  },

  updateAttendance: async (id: number, data: AttendancePayload): Promise<void> => {
    await api.put(`/attendance/${id}`, data);
  },

  deleteAttendance: async (id: number): Promise<void> => {
    await api.delete(`/attendance/${id}`);
  }
};

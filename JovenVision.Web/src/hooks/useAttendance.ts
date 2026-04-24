import { useState, useCallback } from 'react';
import { attendanceService } from '../services/attendanceService';
import type { Attendance, AttendancePayload, AttendanceStatus } from '../types/attendance';

export const useAttendance = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attendanceList, setAttendanceList] = useState<Attendance[]>([]);

  const fetchByEvent = useCallback(async (eventId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await attendanceService.getAttendanceByEvent(eventId);
      setAttendanceList(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar asistencia por evento');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByMember = useCallback(async (memberId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await attendanceService.getAttendanceByMember(memberId);
      setAttendanceList(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar historial del miembro');
    } finally {
      setLoading(false);
    }
  }, []);

  const markAttendance = async (payload: AttendancePayload) => {
    try {
      const result = await attendanceService.markAttendance(payload);
      // Update local state if needed (refetch or manual update)
      setAttendanceList(prev => {
        const existing = prev.findIndex(a => a.memberId === payload.memberId && a.eventId === payload.eventId);
        if (existing !== -1) {
          const updated = [...prev];
          updated[existing] = result;
          return updated;
        }
        return [...prev, result];
      });
      return result;
    } catch (err: any) {
      throw new Error(err.message || 'Error al registrar asistencia');
    }
  };

  const updateAttendance = async (id: number, payload: AttendancePayload) => {
    try {
      await attendanceService.updateAttendance(id, payload);
      setAttendanceList(prev => prev.map(a => a.id === id ? { ...a, status: payload.status } : a));
    } catch (err: any) {
      throw new Error(err.message || 'Error al actualizar asistencia');
    }
  };

  const refresh = useCallback(async (eventId?: number, memberId?: number) => {
    if (eventId) await fetchByEvent(eventId);
    if (memberId) await fetchByMember(memberId);
  }, [fetchByEvent, fetchByMember]);

  return {
    loading,
    error,
    attendanceList,
    fetchByEvent,
    fetchByMember,
    markAttendance,
    updateAttendance,
    refresh
  };
};

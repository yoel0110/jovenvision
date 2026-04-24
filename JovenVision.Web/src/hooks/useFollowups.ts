import { useState, useCallback } from 'react';
import type { FollowUp, FollowUpPayload } from '../types';
import { followupService } from '../services/followupService';

export const useFollowups = () => {
  const [followups, setFollowups] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchByMember = useCallback(async (memberId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await followupService.getFollowupsByMember(memberId);
      if (response.success) {
        setFollowups(response.data);
      } else {
        setError(response.message || 'Error al cargar seguimientos');
      }
    } catch (err: any) {
      setError(err.message || 'Error de red');
    } finally {
      setLoading(false);
    }
  }, []);

  const create = async (data: FollowUpPayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await followupService.createFollowup(data);
      if (response.success) {
        setFollowups(prev => [response.data, ...prev]);
        return response.data;
      } else {
        throw new Error(response.message || 'Error al crear seguimiento');
      }
    } catch (err: any) {
      setError(err.message || 'Error de red');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: 'PENDING' | 'COMPLETED') => {
    const followup = followups.find(f => f.id === id);
    if (!followup) return;

    try {
      const response = await followupService.updateFollowup(id, {
        memberId: followup.memberId,
        type: followup.type,
        description: followup.notes,
        status,
        date: followup.date
      });

      if (response.success) {
        setFollowups(prev => prev.map(f => f.id === id ? { ...f, status } : f));
      } else {
        throw new Error(response.message || 'Error al actualizar estado');
      }
    } catch (err: any) {
      setError(err.message || 'Error de red');
      throw err;
    }
  };

  const remove = async (id: number) => {
    try {
      const response = await followupService.deleteFollowup(id);
      if (response.success) {
        setFollowups(prev => prev.filter(f => f.id !== id));
      } else {
        throw new Error(response.message || 'Error al eliminar');
      }
    } catch (err: any) {
      setError(err.message || 'Error de red');
      throw err;
    }
  };

  return {
    followups,
    loading,
    error,
    fetchByMember,
    create,
    updateStatus,
    remove
  };
};

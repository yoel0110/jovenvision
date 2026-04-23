import { useState, useCallback, useEffect } from 'react';
import { membersService } from '../services/membersService';
import type { Member, MemberPayload, MemberFilters } from '../types/member';

export const useMembers = (initialFilters: MemberFilters = { page: 1, pageSize: 10 }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MemberFilters>(initialFilters);

  const fetchMembers = useCallback(async (currentFilters: MemberFilters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await membersService.getMembers(currentFilters);
      setMembers(response.data);
      setTotalCount(response.totalCount);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar los miembros');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers(filters);
  }, [filters, fetchMembers]);

  const handleFilterChange = (newFilters: Partial<MemberFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const remove = async (id: number) => {
    setLoadingAction(true);
    try {
      await membersService.deleteMember(id);
      await fetchMembers(filters);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'No se pudo eliminar el miembro');
      return false;
    } finally {
      setLoadingAction(false);
    }
  };

  const update = async (id: number, data: MemberPayload) => {
    setLoadingAction(true);
    try {
      await membersService.updateMember(id, data);
      await fetchMembers(filters);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'No se pudo actualizar el miembro');
      return false;
    } finally {
      setLoadingAction(false);
    }
  };

  return {
    members,
    totalCount,
    loading,
    loadingAction,
    error,
    filters,
    handleFilterChange,
    handlePageChange,
    refresh: () => fetchMembers(filters),
    remove,
    update
  };
};

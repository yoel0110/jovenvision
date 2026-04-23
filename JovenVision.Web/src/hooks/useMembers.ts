import { useState, useCallback, useEffect } from 'react';
import { membersService } from '../services/membersService';
import type { Member, MemberPayload, MemberFilters } from '../types/member';

export const useMembers = (initialFilters: MemberFilters = { page: 1, pageSize: 10 }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
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
    try {
      await membersService.deleteMember(id);
      await fetchMembers(filters);
      return true;
    } catch (err) {
      setError('No se pudo eliminar el miembro');
      return false;
    }
  };

  return {
    members,
    totalCount,
    loading,
    error,
    filters,
    handleFilterChange,
    handlePageChange,
    refresh: () => fetchMembers(filters),
    remove
  };
};

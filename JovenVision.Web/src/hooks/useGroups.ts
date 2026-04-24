import { useState, useCallback, useEffect } from 'react';
import { groupsService } from '../services/groupsService';
import type { Group, GroupPayload, GroupFilters } from '../types/group';

export const useGroups = (initialFilters: GroupFilters = { page: 1, pageSize: 10 }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<GroupFilters>(initialFilters);

  const fetchGroups = useCallback(async (currentFilters: GroupFilters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await groupsService.getGroups(currentFilters);
      setGroups(response?.data || (Array.isArray(response) ? response : []));
      setTotalCount(response?.totalCount || (Array.isArray(response) ? response.length : 0));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar los grupos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups(filters);
  }, [filters, fetchGroups]);

  const handleFilterChange = (newFilters: Partial<GroupFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const remove = async (id: number) => {
    setLoadingAction(true);
    try {
      await groupsService.deleteGroup(id);
      await fetchGroups(filters);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'No se pudo eliminar el grupo');
      return false;
    } finally {
      setLoadingAction(false);
    }
  };

  const update = async (id: number, data: GroupPayload) => {
    setLoadingAction(true);
    try {
      await groupsService.updateGroup(id, data);
      await fetchGroups(filters);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'No se pudo actualizar el grupo');
      return false;
    } finally {
      setLoadingAction(false);
    }
  };

  return {
    groups,
    totalCount,
    loading,
    loadingAction,
    error,
    filters,
    handleFilterChange,
    handlePageChange,
    refresh: () => fetchGroups(filters),
    remove,
    update
  };
};

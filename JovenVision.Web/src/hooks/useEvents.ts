import { useState, useCallback, useEffect } from 'react';
import { eventsService } from '../services/eventsService';
import type { Event, EventPayload, EventFilters } from '../types/event';

export const useEvents = (initialFilters: EventFilters = { page: 1, pageSize: 10 }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<EventFilters>(initialFilters);

  const fetchEvents = useCallback(async (currentFilters: EventFilters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await eventsService.getEvents(currentFilters);
      setEvents(response.data);
      setTotalCount(response.totalCount);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar los eventos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents(filters);
  }, [filters, fetchEvents]);

  const handleFilterChange = (newFilters: Partial<EventFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const remove = async (id: number) => {
    setLoadingAction(true);
    try {
      await eventsService.deleteEvent(id);
      await fetchEvents(filters);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'No se pudo eliminar el evento');
      return false;
    } finally {
      setLoadingAction(false);
    }
  };

  const update = async (id: number, data: EventPayload) => {
    setLoadingAction(true);
    try {
      await eventsService.updateEvent(id, data);
      await fetchEvents(filters);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'No se pudo actualizar el evento');
      return false;
    } finally {
      setLoadingAction(false);
    }
  };

  const create = async (data: EventPayload) => {
    setLoadingAction(true);
    try {
      await eventsService.createEvent(data);
      await fetchEvents(filters);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'No se pudo crear el evento');
      return false;
    } finally {
      setLoadingAction(false);
    }
  };

  return {
    events,
    totalCount,
    loading,
    loadingAction,
    error,
    filters,
    handleFilterChange,
    handlePageChange,
    refresh: () => fetchEvents(filters),
    remove,
    update,
    create
  };
};

import api from './api';
import type { Event, EventPayload, EventFilters, EventListResponse } from '../types/event';

export const eventsService = {
  getEvents: async (params?: EventFilters): Promise<EventListResponse> => {
    const response = await api.get('/api/events', { params });
    // Assuming the API follows the same response pattern: { success: boolean, data: { data: Event[], totalCount: number, ... } }
    return response.data.data;
  },

  getEventById: async (id: number): Promise<Event> => {
    const response = await api.get(`/api/events/${id}`);
    return response.data.data;
  },

  createEvent: async (data: EventPayload): Promise<Event> => {
    const response = await api.post('/api/events', data);
    return response.data.data;
  },

  updateEvent: async (id: number, data: EventPayload): Promise<Event> => {
    const response = await api.put(`/api/events/${id}`, data);
    return response.data.data;
  },

  deleteEvent: async (id: number): Promise<void> => {
    await api.delete(`/api/events/${id}`);
  }
};

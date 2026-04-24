import api from './api';
import type { JovenEvent, EventPayload, EventFilters, EventListResponse } from '../types/event';

export const eventsService = {
  getEvents: async (params?: EventFilters): Promise<EventListResponse> => {
    const response = await api.get('/events', { params });
    // Assuming the API follows the same response pattern: { success: boolean, data: { data: JovenEvent[], totalCount: number, ... } }
    return response.data.data;
  },

  getEventById: async (id: number): Promise<JovenEvent> => {
    const response = await api.get(`/events/${id}`);
    return response.data.data;
  },

  createEvent: async (data: EventPayload): Promise<JovenEvent> => {
    const response = await api.post('/events', data);
    return response.data.data;
  },

  updateEvent: async (id: number, data: EventPayload): Promise<JovenEvent> => {
    const response = await api.put(`/events/${id}`, data);
    return response.data.data;
  },

  deleteEvent: async (id: number): Promise<void> => {
    await api.delete(`/events/${id}`);
  }
};

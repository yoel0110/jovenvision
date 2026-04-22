import api from './api';
import type { ApiResponse, EngagementMetrics, TimeSeriesData, DashboardFilters } from '../types/dashboard';

export const dashboardService = {
  getEngagementMetrics: async (filters?: DashboardFilters): Promise<ApiResponse<EngagementMetrics>> => {
    const params = new URLSearchParams();
    
    if (filters?.dateRange) {
      params.append('startDate', filters.dateRange.start.toISOString());
      params.append('endDate', filters.dateRange.end.toISOString());
    }
    
    if (filters?.userSegments?.length) {
      params.append('segments', filters.userSegments.join(','));
    }
    
    if (filters?.metricTypes?.length) {
      params.append('metrics', filters.metricTypes.join(','));
    }
    
    const queryString = params.toString();
    const endpoint = `/api/dashboard/engagement${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get<ApiResponse<EngagementMetrics>>(endpoint);
    return response.data;
  },

  getTimeSeriesData: async (metricType: string, filters?: DashboardFilters): Promise<ApiResponse<TimeSeriesData[]>> => {
    const params = new URLSearchParams();
    
    if (filters?.dateRange) {
      params.append('startDate', filters.dateRange.start.toISOString());
      params.append('endDate', filters.dateRange.end.toISOString());
    }
    
    if (filters?.userSegments?.length) {
      params.append('segments', filters.userSegments.join(','));
    }
    
    if (filters?.metricTypes?.length) {
      params.append('metrics', filters.metricTypes.join(','));
    }
    
    const queryString = params.toString();
    const endpoint = `/api/dashboard/timeseries/${metricType}${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get<ApiResponse<TimeSeriesData[]>>(endpoint);
    return response.data;
  },

  getMetricsOverview: async (filters?: DashboardFilters): Promise<ApiResponse<Record<string, number>>> => {
    const params = new URLSearchParams();
    
    if (filters?.dateRange) {
      params.append('startDate', filters.dateRange.start.toISOString());
      params.append('endDate', filters.dateRange.end.toISOString());
    }
    
    if (filters?.userSegments?.length) {
      params.append('segments', filters.userSegments.join(','));
    }
    
    if (filters?.metricTypes?.length) {
      params.append('metrics', filters.metricTypes.join(','));
    }
    
    const queryString = params.toString();
    const endpoint = `/api/dashboard/overview${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get<ApiResponse<Record<string, number>>>(endpoint);
    return response.data;
  },

  refreshMetrics: async (): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await api.post<ApiResponse<{ success: boolean }>>('/api/dashboard/refresh');
    return response.data;
  },
};

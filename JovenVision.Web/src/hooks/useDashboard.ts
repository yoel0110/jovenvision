import { useState, useEffect, useCallback } from 'react';
import type { 
  DashboardState, 
  DashboardFilters, 
  DashboardMetric,
  TimeSeriesData 
} from '../types/dashboard';
import { dashboardService } from '../services';

const initialState: DashboardState = {
  metrics: [],
  widgets: [],
  loading: false,
  error: null,
  lastRefreshed: null,
  filters: {
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      end: new Date(),
    },
  },
};

export const useDashboard = (initialFilters?: Partial<DashboardFilters>) => {
  const [state, setState] = useState<DashboardState>({
    ...initialState,
    filters: {
      ...initialState.filters,
      ...initialFilters,
    },
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, loading: false }));
  }, []);

  const updateFilters = useCallback((newFilters: Partial<DashboardFilters>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters },
    }));
  }, []);

  const fetchEngagementMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await dashboardService.getEngagementMetrics(state.filters);
      
      if (response.success && response.data) {
        const metrics: DashboardMetric[] = [
          {
            id: 'total-users',
            name: 'Total Users',
            value: response.data.totalUsers,
            unit: 'users',
            lastUpdated: new Date(),
          },
          {
            id: 'active-users',
            name: 'Active Users',
            value: response.data.activeUsers,
            unit: 'users',
            lastUpdated: new Date(),
          },
          {
            id: 'participation-rate',
            name: 'Participation Rate',
            value: response.data.participationRate,
            unit: '%',
            lastUpdated: new Date(),
          },
          {
            id: 'avg-session-duration',
            name: 'Avg Session Duration',
            value: response.data.averageSessionDuration,
            unit: 'min',
            lastUpdated: new Date(),
          },
          {
            id: 'interactions',
            name: 'Interactions',
            value: response.data.interactionsCount,
            unit: 'count',
            lastUpdated: new Date(),
          },
          {
            id: 'new-users',
            name: 'New Users',
            value: response.data.newUsersThisPeriod,
            unit: 'users',
            lastUpdated: new Date(),
          },
        ];

        setState(prev => ({
          ...prev,
          metrics,
          lastRefreshed: new Date(),
        }));
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch metrics');
    } finally {
      setLoading(false);
    }
  }, [state.filters, setLoading, setError]);

  const fetchTimeSeriesData = useCallback(async (metricType: string): Promise<TimeSeriesData[]> => {
    try {
      const response = await dashboardService.getTimeSeriesData(metricType, state.filters);
      return response.success ? response.data : [];
    } catch (error) {
      console.error(`Failed to fetch time series data for ${metricType}:`, error);
      return [];
    }
  }, [state.filters]);

  const refreshData = useCallback(async () => {
    await fetchEngagementMetrics();
  }, [fetchEngagementMetrics]);

  const refreshMetrics = useCallback(async () => {
    try {
      await dashboardService.refreshMetrics();
      await refreshData();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to refresh metrics');
    }
  }, [refreshData, setError]);

  useEffect(() => {
    fetchEngagementMetrics();
  }, [fetchEngagementMetrics]);

  return {
    ...state,
    updateFilters,
    refreshData,
    refreshMetrics,
    fetchTimeSeriesData,
  };
};

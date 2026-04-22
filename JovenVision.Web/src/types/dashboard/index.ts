export interface DashboardMetric {
  id: string;
  name: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  change?: number;
  lastUpdated: Date;
}

export interface EngagementMetrics {
  totalUsers: number;
  activeUsers: number;
  participationRate: number;
  averageSessionDuration: number;
  interactionsCount: number;
  newUsersThisPeriod: number;
}

export interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'card';
  title: string;
  data: any;
  config?: Record<string, any>;
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface DashboardState {
  metrics: DashboardMetric[];
  widgets: DashboardWidget[];
  loading: boolean;
  error: string | null;
  lastRefreshed: Date | null;
  filters: DashboardFilters;
}

export interface DashboardFilters {
  dateRange: {
    start: Date;
    end: Date;
  };
  userSegments?: string[];
  metricTypes?: string[];
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: Date;
}

export type MetricType = 
  | 'user_engagement'
  | 'content_interaction'
  | 'session_duration'
  | 'participation_rate'
  | 'new_users'
  | 'active_users';

export interface TimeSeriesData {
  timestamp: Date;
  value: number;
  label?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

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

export interface MemberActivity {
  memberId: number;
  memberName: string;
  lastAttendanceDate: Date | null;
  totalAttendances: number;
  attendancesLast7Days: number;
  attendancesLast30Days: number;
  status: 'active' | 'inactive' | 'at-risk';
  riskLevel: 'low' | 'medium' | 'high';
}

export interface GroupParticipation {
  groupId: number;
  groupName: string;
  totalMembers: number;
  activeMembers: number;
  averageAttendanceRate: number;
  participationLevel: 'high' | 'medium' | 'low';
}

export interface EventConfirmation {
  eventId: number;
  eventTitle: string;
  eventDate: Date;
  totalInvited: number;
  confirmedAttendances: number;
  confirmationRate: number;
  confirmationLevel: 'high' | 'medium' | 'low';
}

export interface RetentionMetrics {
  period: '7-days' | '30-days';
  totalMembers: number;
  retainedMembers: number;
  newMembers: number;
  churnedMembers: number;
  retentionRate: number;
  churnRate: number;
}

export interface DashboardKPIs {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  overallAttendanceRate: number;
  membersAtRisk: number;
  groupsLowParticipation: number;
  eventsLowConfirmation: number;
  retention7Days: RetentionMetrics;
  retention30Days: RetentionMetrics;
}

export interface MemberRiskFactors {
  daysSinceLastAttendance: number;
  attendanceFrequency: number;
  participationTrend: 'increasing' | 'stable' | 'decreasing';
  riskScore: number;
  riskReasons: string[];
}

export interface ActivityThresholds {
  inactiveDaysThreshold: number;
  riskDaysThreshold: number;
  lowAttendanceRateThreshold: number;
  lowConfirmationRateThreshold: number;
}

export interface MetricCalculationRule {
  name: string;
  description: string;
  formula: string;
  parameters: Record<string, any>;
  category: 'participation' | 'retention' | 'risk' | 'engagement';
}

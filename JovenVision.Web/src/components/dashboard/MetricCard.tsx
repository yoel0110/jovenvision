import type { DashboardMetric } from '../../types/dashboard';

interface MetricCardProps {
  metric: DashboardMetric;
  className?: string;
}

export const MetricCard = ({ metric, className = '' }: MetricCardProps) => {
  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'arrow_upward';
      case 'down':
        return 'arrow_downward';
      default:
        return 'remove';
    }
  };

  const getTrendColor = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{metric.name}</p>
          <p className="text-2xl font-semibold text-gray-900">
            {metric.value}
            {metric.unit && <span className="text-sm text-gray-500 ml-1">{metric.unit}</span>}
          </p>
        </div>
        {metric.trend && (
          <div className={`flex items-center ${getTrendColor(metric.trend)}`}>
            <span className="material-icons text-sm">{getTrendIcon(metric.trend)}</span>
            {metric.change && (
              <span className="text-sm ml-1">{Math.abs(metric.change)}%</span>
            )}
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Last updated: {metric.lastUpdated.toLocaleString()}
      </p>
    </div>
  );
};

import type { DashboardMetric } from '../../types/dashboard';
import '../../styles/dashboard.css';

interface MetricCardProps {
  metric: DashboardMetric;
  className?: string;
}

export const MetricCard = ({ metric, className = '' }: MetricCardProps) => {
  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'trending_up';
      case 'down':
        return 'trending_down';
      default:
        return 'trending_flat';
    }
  };

  const getTrendColor = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-50';
      case 'down':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getMetricColor = (name: string) => {
    const colors = {
      'Total Members': 'text-blue-600',
      'Active Members': 'text-green-600', 
      'Participation Rate': 'text-purple-600',
      'Avg Session Duration': 'text-orange-600',
      'Interactions': 'text-indigo-600',
      'New Members': 'text-teal-600'
    };
    return colors[name as keyof typeof colors] || 'text-gray-600';
  };

  const formatValue = (value: number | string, unit?: string) => {
    if (typeof value === 'number') {
      if (unit === '%') {
        return `${value.toFixed(1)}%`;
      }
      if (unit === 'min') {
        return `${value.toFixed(1)} min`;
      }
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      }
      if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
      }
      return value.toLocaleString();
    }
    return value;
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 ${className}`}>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
              {metric.name}
            </p>
            <div className="flex items-baseline">
              <span className={`text-3xl font-bold ${getMetricColor(metric.name)}`}>
                {formatValue(metric.value, metric.unit)}
              </span>
              {metric.unit && (
                <span className="text-sm font-medium text-gray-500 ml-2">
                  {metric.unit}
                </span>
              )}
            </div>
            {metric.change !== undefined && (
              <div className="flex items-center mt-2">
                <span className={`material-icons text-sm mr-1 ${getTrendColor(metric.trend).split(' ')[0]}`}>
                  {getTrendIcon(metric.trend)}
                </span>
                <span className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                  {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          
          <div className="ml-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getMetricColor(metric.name)} bg-opacity-10`}>
              <span className="material-icons text-lg">
                {(metric.id === 'total-users' || metric.id === 'total-members') && 'groups'}
                {(metric.id === 'active-users' || metric.id === 'active-members') && 'person_check'}
                {metric.id === 'participation-rate' && 'percent'}
                {metric.id === 'avg-session-duration' && 'schedule'}
                {metric.id === 'interactions' && 'handshake'}
                {(metric.id === 'new-users' || metric.id === 'new-members') && 'person_add'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Actualizado el {metric.lastUpdated.toLocaleDateString()}
            </span>
            <span className="text-xs text-gray-400">
              {metric.lastUpdated.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

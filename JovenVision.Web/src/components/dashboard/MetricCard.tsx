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

  // Helper methods removed in favor of semantic CSS classes defined in dashboard.css

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
    <div className="metric-card">
      <div className="metric-header">
        <div className="metric-info">
          <p className="metric-label">{metric.name}</p>
          <div className="metric-value-container">
            <span className="metric-value">
              {formatValue(metric.value, metric.unit)}
            </span>
          </div>
          {metric.change !== undefined && (
            <div className={`trend-badge ${metric.trend || 'stable'}`}>
              <span className="material-symbols-outlined">
                {getTrendIcon(metric.trend)}
              </span>
              <span>{metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%</span>
            </div>
          )}
        </div>
        
        <div className="metric-icon">
          <span className="material-symbols-outlined">
            {(metric.id === 'total-users' || metric.id === 'total-members') && 'groups'}
            {(metric.id === 'active-users' || metric.id === 'active-members') && 'person_check'}
            {metric.id === 'participation-rate' && 'percent'}
            {metric.id === 'avg-session-duration' && 'schedule'}
            {metric.id === 'interactions' && 'handshake'}
            {(metric.id === 'new-users' || metric.id === 'new-members') && 'person_add'}
          </span>
        </div>
      </div>
      
      <div className="metric-footer">
        <span className="sync-text">
          Actualizado el {metric.lastUpdated.toLocaleDateString()}
        </span>
        <span className="sync-time">
          {metric.lastUpdated.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

import type { DashboardMetric } from '../../types/dashboard';
import { MetricCard } from './MetricCard';
import '../../styles/dashboard.css';

interface MetricGridProps {
  metrics: DashboardMetric[];
  loading?: boolean;
  className?: string;
}

export const MetricGrid = ({ metrics, loading = false, className = '' }: MetricGridProps) => {
  if (loading) {
    return (
      <div className="metric-grid">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="metric-card skeleton">
            <div className="skeleton-header">
              <div className="skeleton-line short"></div>
              <div className="skeleton-square"></div>
            </div>
            <div className="skeleton-line medium"></div>
            <div className="skeleton-footer">
              <div className="skeleton-line long"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (metrics.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <span className="material-symbols-outlined">bar_chart</span>
        </div>
        <h3>No hay métricas disponibles</h3>
        <p>
          Actualmente no hay métricas para mostrar. Intenta ajustar tus filtros o vuelve a consultarlo más tarde.
        </p>
      </div>
    );
  }

  return (
    <div className="metric-grid animate-fadeInUp">
      {metrics.map((metric) => (
        <MetricCard key={metric.id} metric={metric} />
      ))}
    </div>
  );
};

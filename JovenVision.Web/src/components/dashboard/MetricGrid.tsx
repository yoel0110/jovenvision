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
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-32 mb-3"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between">
                <div className="h-3 bg-gray-200 rounded w-20"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (metrics.length === 0) {
    return (
      <div className={`text-center py-16 ${className}`}>
        <div className="flex flex-col items-center">
          <span className="material-icons text-6xl text-gray-300 mb-4">bar_chart</span>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay métricas disponibles</h3>
          <p className="text-gray-500 max-w-md">
            Actualmente no hay métricas para mostrar. Intenta ajustar tus filtros o vuelve a consultarlo más tarde.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {metrics.map((metric, index) => (
        <div 
          key={metric.id} 
          className="transform transition-all duration-500 hover:scale-105"
          style={{
            animationDelay: `${index * 100}ms`,
            animation: 'fadeInUp 0.6s ease-out forwards'
          }}
        >
          <MetricCard metric={metric} />
        </div>
      ))}
    </div>
  );
};

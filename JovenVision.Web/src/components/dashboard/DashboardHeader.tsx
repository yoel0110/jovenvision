import type { DashboardFilters } from '../../types/dashboard';
import '../../styles/dashboard.css';

interface DashboardHeaderProps {
  filters: DashboardFilters;
  onFiltersChange: (filters: Partial<DashboardFilters>) => void;
  onRefresh: () => void;
  loading?: boolean;
  lastRefreshed?: Date | null;
}

export const DashboardHeader = ({ 
  filters, 
  onFiltersChange, 
  onRefresh, 
  loading = false, 
  lastRefreshed 
}: DashboardHeaderProps) => {
  const handleDateRangeChange = (start: Date, end: Date) => {
    onFiltersChange({
      dateRange: { start, end }
    });
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getQuickDateRange = (days: number) => {
    const end = new Date();
    const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
    return { start, end };
  };

  return (
    <div className="header-card">
      <div className="header-content">
        <div className="header-info">
          <div className="header-text">
            <h1>Dashboard</h1>
            <p>Análisis de participación de JovenVision</p>
          </div>
          
          <div className="quick-filters">
            <button
              onClick={() => onFiltersChange({ dateRange: getQuickDateRange(7) })}
              className="btn-quick"
            >
              7 días
            </button>
            <button
              onClick={() => onFiltersChange({ dateRange: getQuickDateRange(30) })}
              className="btn-quick"
            >
              30 días
            </button>
            <button
              onClick={() => onFiltersChange({ dateRange: getQuickDateRange(90) })}
              className="btn-quick"
            >
              90 días
            </button>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="btn-premium"
        >
          {loading ? (
            <span className="loading-spinner"></span>
          ) : (
            <span className="material-symbols-outlined">refresh</span>
          )}
          <span>{loading ? 'Cargando...' : 'Actualizar'}</span>
        </button>
      </div>

      <div className="filter-section">
        <div className="date-picker-grid">
          <div className="date-input-group">
            <label>Desde</label>
            <input
              type="date"
              value={formatDate(filters.dateRange.start)}
              onChange={(e) => handleDateRangeChange(
                new Date(e.target.value),
                filters.dateRange.end
              )}
            />
          </div>
          
          <div className="date-input-group">
            <label>Hasta</label>
            <input
              type="date"
              value={formatDate(filters.dateRange.end)}
              onChange={(e) => handleDateRangeChange(
                filters.dateRange.start,
                new Date(e.target.value)
              )}
            />
          </div>

          {lastRefreshed && (
            <div className="sync-info">
              <span className="material-symbols-outlined">sync</span>
              Sincronizado: {lastRefreshed.toLocaleDateString()} {lastRefreshed.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import { useDashboard } from '../hooks/useDashboard';
import { DashboardHeader, MetricGrid } from '../components/dashboard';
import '../styles/dashboard.css';

export const Dashboard = () => {
  const {
    metrics,
    loading,
    error,
    filters,
    lastRefreshed,
    updateFilters,
    refreshData,
  } = useDashboard();

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-banner animate-fadeInUp">
          <span className="material-symbols-outlined">error</span>
          <div>
            <h3>Error al cargar el tablero</h3>
            <p>{error}</p>
            <button 
              onClick={refreshData}
              className="btn-premium"
              style={{ marginTop: '16px' }}
            >
              <span className="material-symbols-outlined">refresh</span>
              <span>Reintentar</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container animate-fadeInUp">
      <DashboardHeader
        filters={filters}
        onFiltersChange={updateFilters}
        onRefresh={refreshData}
        loading={loading}
        lastRefreshed={lastRefreshed}
      />
      
      <div className="metric-section">
        <MetricGrid metrics={metrics} loading={loading} />
      </div>
    </div>
  );
};

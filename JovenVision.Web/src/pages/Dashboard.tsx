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
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 animate-fadeInUp">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="material-icons text-red-600">error</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-red-900">Error al cargar el tablero</h3>
              <div className="mt-1 text-sm text-red-700">
                <p>No se pudieron recuperar los datos. Por favor, intenta de nuevo más tarde.</p>
              </div>
              <button 
                onClick={refreshData}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
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
      
      <div className="py-6">
        <MetricGrid metrics={metrics} loading={loading} />
      </div>
    </div>
  );
};

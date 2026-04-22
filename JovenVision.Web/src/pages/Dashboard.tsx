import { useDashboard } from '../hooks/useDashboard';
import { DashboardHeader, MetricGrid } from '../components/dashboard';

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
      <div className="page">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="material-icons text-red-400">error</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading dashboard</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <DashboardHeader
        filters={filters}
        onFiltersChange={updateFilters}
        onRefresh={refreshData}
        loading={loading}
        lastRefreshed={lastRefreshed}
      />
      
      <div className="px-6 py-6">
        <MetricGrid metrics={metrics} loading={loading} />
      </div>
    </div>
  );
};

import type { DashboardFilters } from '../../types/dashboard';

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

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600">JovenVision Engagement Metrics</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">From:</label>
              <input
                type="date"
                value={formatDate(filters.dateRange.start)}
                onChange={(e) => handleDateRangeChange(
                  new Date(e.target.value),
                  filters.dateRange.end
                )}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">To:</label>
              <input
                type="date"
                value={formatDate(filters.dateRange.end)}
                onChange={(e) => handleDateRangeChange(
                  filters.dateRange.start,
                  new Date(e.target.value)
                )}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <button
              onClick={onRefresh}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <span className="material-icons text-sm">refresh</span>
              <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
        
        {lastRefreshed && (
          <div className="mt-2 text-xs text-gray-500">
            Last refreshed: {lastRefreshed.toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
};

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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-header px-6 py-6 border-b border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gradient-blue">
                  Dashboard
                </h1>
                <p className="text-sm text-gray-500 mt-1">Análisis de participación de JovenVision</p>
              </div>
              <div className="hidden lg:flex items-center space-x-2 ml-8">
                <button
                  onClick={() => onFiltersChange({ dateRange: getQuickDateRange(7) })}
                  className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-all"
                >
                  Últimos 7 días
                </button>
                <button
                  onClick={() => onFiltersChange({ dateRange: getQuickDateRange(30) })}
                  className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-all"
                >
                  Últimos 30 días
                </button>
                <button
                  onClick={() => onFiltersChange({ dateRange: getQuickDateRange(90) })}
                  className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-all"
                >
                  Últimos 90 días
                </button>
              </div>
            </div>
            
            <div className="flex flex-row items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-inner mt-4">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Desde</span>
                <input
                  type="date"
                  value={formatDate(filters.dateRange.start)}
                  onChange={(e) => handleDateRangeChange(
                    new Date(e.target.value),
                    filters.dateRange.end
                  )}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all w-36"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Hasta</span>
                <input
                  type="date"
                  value={formatDate(filters.dateRange.end)}
                  onChange={(e) => handleDateRangeChange(
                    filters.dateRange.start,
                    new Date(e.target.value)
                  )}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all w-36"
                />
              </div>
              
              <div className="flex-1"></div>
              
              <button
                onClick={onRefresh}
                disabled={loading}
                className="px-4 py-1.5 btn-refresh-minimal rounded text-sm font-semibold flex items-center space-x-2 disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <span className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></span>
                ) : (
                  <span className="material-symbols-outlined text-sm">refresh</span>
                )}
                <span>{loading ? 'Cargando...' : 'Actualizar'}</span>
              </button>
            </div>
          </div>
        </div>
        
        {lastRefreshed && (
          <div className="mt-4 flex items-center text-[12px] text-gray-500 font-medium">
            <span className="bg-white px-2 py-0.5 rounded border border-gray-100 shadow-sm">
              Sincronizado: {lastRefreshed.toLocaleDateString()} {lastRefreshed.toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

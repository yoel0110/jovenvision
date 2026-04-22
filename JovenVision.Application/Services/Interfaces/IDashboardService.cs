using JovenVision.Application.DTOs.Dashboard;

namespace JovenVision.Application.Services.Interfaces
{
    public interface IDashboardService
    {
        Task<EngagementMetricsDto> GetEngagementMetricsAsync(DateTime? startDate = null, DateTime? endDate = null);
        Task<List<TimeSeriesDataDto>> GetTimeSeriesDataAsync(string metricType, DateTime? startDate = null, DateTime? endDate = null);
        Task<DashboardOverviewDto> GetMetricsOverviewAsync(DateTime? startDate = null, DateTime? endDate = null);
        Task<RefreshResponseDto> RefreshMetricsAsync();
    }
}

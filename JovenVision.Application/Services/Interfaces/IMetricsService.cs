using JovenVision.Domain.Entities;

namespace JovenVision.Application.Services.Interfaces
{
    public interface IMetricsService
    {
        Task<Metrics> GetMetrics();
    }
}
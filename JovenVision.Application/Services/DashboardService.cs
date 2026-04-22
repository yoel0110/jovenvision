using JovenVision.Application.DTOs.Dashboard;
using JovenVision.Application.Services.Interfaces;
using JovenVision.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace JovenVision.Application.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly JovenVisionDbContext _context;

        public DashboardService(JovenVisionDbContext context)
        {
            _context = context;
        }

        public async Task<EngagementMetricsDto> GetEngagementMetricsAsync(DateTime? startDate = null, DateTime? endDate = null)
        {
            var start = startDate ?? DateTime.UtcNow.AddDays(-30);
            var end = endDate ?? DateTime.UtcNow;

            var totalUsers = await _context.Members
                .Where(m => m.Status == "Active")
                .CountAsync();

            var activeUsers = await _context.Attendances
                .Where(a => a.RegisteredAt >= start && a.RegisteredAt <= end && a.Status == "Confirmed")
                .Select(a => a.MemberId)
                .Distinct()
                .CountAsync();

            var participationRate = totalUsers > 0 ? (double)activeUsers / totalUsers * 100 : 0;

            var averageSessionDuration = 15.5;

            var interactionsCount = await _context.Attendances
                .Where(a => a.Status == "Confirmed")
                .CountAsync();

            var newUsersThisPeriod = await _context.Members
                .Where(m => m.CreatedAt >= start && m.CreatedAt <= end)
                .CountAsync();

            return new EngagementMetricsDto
            {
                TotalUsers = totalUsers,
                ActiveUsers = activeUsers,
                ParticipationRate = Math.Round(participationRate, 2),
                AverageSessionDuration = averageSessionDuration,
                InteractionsCount = interactionsCount,
                NewUsersThisPeriod = newUsersThisPeriod
            };
        }

        public async Task<List<TimeSeriesDataDto>> GetTimeSeriesDataAsync(string metricType, DateTime? startDate = null, DateTime? endDate = null)
        {
            var start = startDate ?? DateTime.UtcNow.AddDays(-30);
            var end = endDate ?? DateTime.UtcNow;

            var data = new List<TimeSeriesDataDto>();

            switch (metricType.ToLower())
            {
                case "user_engagement":
                    data = await GetUserEngagementTimeSeries(start, end);
                    break;
                case "participation_rate":
                    data = await GetParticipationRateTimeSeries(start, end);
                    break;
                case "new_users":
                    data = await GetNewUsersTimeSeries(start, end);
                    break;
                case "active_users":
                    data = await GetActiveUsersTimeSeries(start, end);
                    break;
                default:
                    data = await GetUserEngagementTimeSeries(start, end);
                    break;
            }

            return data;
        }

        public async Task<DashboardOverviewDto> GetMetricsOverviewAsync(DateTime? startDate = null, DateTime? endDate = null)
        {
            var engagementMetrics = await GetEngagementMetricsAsync(startDate, endDate);

            return new DashboardOverviewDto
            {
                TotalUsers = engagementMetrics.TotalUsers,
                ActiveUsers = engagementMetrics.ActiveUsers,
                ParticipationRate = engagementMetrics.ParticipationRate,
                AverageSessionDuration = engagementMetrics.AverageSessionDuration,
                InteractionsCount = engagementMetrics.InteractionsCount,
                NewUsersThisPeriod = engagementMetrics.NewUsersThisPeriod
            };
        }

        public async Task<RefreshResponseDto> RefreshMetricsAsync()
        {
            await Task.Delay(500);
            return new RefreshResponseDto { Success = true };
        }

        private async Task<List<TimeSeriesDataDto>> GetUserEngagementTimeSeries(DateTime start, DateTime end)
        {
            var dailyData = await _context.Attendances
                .Where(a => a.RegisteredAt >= start && a.RegisteredAt <= end && a.Status == "Confirmed")
                .GroupBy(a => DateTime.SpecifyKind(a.RegisteredAt.Date, DateTimeKind.Utc))
                .Select(g => new
                {
                    Date = g.Key,
                    Count = g.Count()
                })
                .OrderBy(x => x.Date)
                .ToListAsync();

            return dailyData.Select(x => new TimeSeriesDataDto
            {
                Timestamp = x.Date,
                Value = x.Count,
                Label = x.Date.ToString("yyyy-MM-dd")
            }).ToList();
        }

        private async Task<List<TimeSeriesDataDto>> GetParticipationRateTimeSeries(DateTime start, DateTime end)
        {
            var dailyData = new List<TimeSeriesDataDto>();
            var current = start.Date;
            
            while (current <= end.Date)
            {
                var nextDay = current.AddDays(1);
                
                var totalMembers = await _context.Members
                    .Where(m => m.Status == "Active" && m.CreatedAt <= nextDay)
                    .CountAsync();

                var activeMembers = await _context.Attendances
                    .Where(a => a.RegisteredAt >= current && a.RegisteredAt < nextDay && a.Status == "Confirmed")
                    .Select(a => a.MemberId)
                    .Distinct()
                    .CountAsync();

                var rate = totalMembers > 0 ? (double)activeMembers / totalMembers * 100 : 0;

                dailyData.Add(new TimeSeriesDataDto
                {
                    Timestamp = current,
                    Value = Math.Round(rate, 2),
                    Label = current.ToString("yyyy-MM-dd")
                });

                current = current.AddDays(1);
            }

            return dailyData;
        }

        private async Task<List<TimeSeriesDataDto>> GetNewUsersTimeSeries(DateTime start, DateTime end)
        {
            var dailyData = await _context.Members
                .Where(m => m.CreatedAt >= start && m.CreatedAt <= end)
                .GroupBy(m => DateTime.SpecifyKind(m.CreatedAt.Date, DateTimeKind.Utc))
                .Select(g => new
                {
                    Date = g.Key,
                    Count = g.Count()
                })
                .OrderBy(x => x.Date)
                .ToListAsync();

            return dailyData.Select(x => new TimeSeriesDataDto
            {
                Timestamp = x.Date,
                Value = x.Count,
                Label = x.Date.ToString("yyyy-MM-dd")
            }).ToList();
        }

        private async Task<List<TimeSeriesDataDto>> GetActiveUsersTimeSeries(DateTime start, DateTime end)
        {
            var dailyData = new List<TimeSeriesDataDto>();
            var current = start.Date;
            
            while (current <= end.Date)
            {
                var nextDay = current.AddDays(1);
                
                var activeMembers = await _context.Attendances
                    .Where(a => a.RegisteredAt >= current && a.RegisteredAt < nextDay && a.Status == "Confirmed")
                    .Select(a => a.MemberId)
                    .Distinct()
                    .CountAsync();

                dailyData.Add(new TimeSeriesDataDto
                {
                    Timestamp = current,
                    Value = activeMembers,
                    Label = current.ToString("yyyy-MM-dd")
                });

                current = current.AddDays(1);
            }

            return dailyData;
        }
    }
}

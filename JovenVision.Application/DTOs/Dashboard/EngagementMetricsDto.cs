namespace JovenVision.Application.DTOs.Dashboard
{
    public class EngagementMetricsDto
    {
        public int TotalUsers { get; set; }
        public int ActiveUsers { get; set; }
        public double ParticipationRate { get; set; }
        public double AverageSessionDuration { get; set; }
        public int InteractionsCount { get; set; }
        public int NewUsersThisPeriod { get; set; }
    }

    public class TimeSeriesDataDto
    {
        public DateTime Timestamp { get; set; }
        public double Value { get; set; }
        public string? Label { get; set; }
    }

    public class DashboardOverviewDto
    {
        public int TotalUsers { get; set; }
        public int ActiveUsers { get; set; }
        public double ParticipationRate { get; set; }
        public double AverageSessionDuration { get; set; }
        public int InteractionsCount { get; set; }
        public int NewUsersThisPeriod { get; set; }
    }

    public class RefreshResponseDto
    {
        public bool Success { get; set; }
    }
}


namespace JovenVision.Domain.Entities
{
    public class Metrics
    {
        public int TotalUsers { get; set; }
        public int ActiveUsers { get; set; }
       public double ParticipationRate { get; set;}
        public double AverageSessionDuration { get; set;}
       public int InteractionsCount { get; set;}
       public int NewUsersThisPeriod { get; set;}

    }
}
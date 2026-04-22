namespace JovenVision.Domain.Entities
{
    public class Attendance
    {
        public int Id { get; set; }
        public string Status { get; set; }
        public DateTime RegisteredAt { get; set; } = DateTime.Now;
        public int MemberId { get; set; }
        public int EventId { get; set; }
        
    }
}

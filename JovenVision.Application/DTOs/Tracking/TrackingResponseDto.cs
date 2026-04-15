namespace JovenVision.Application.DTOs.Tracking
{
    public class TrackingResponseDto
    {
        public int Id { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string Type { get; set; } = string.Empty;
        public int MemberId { get; set; }
    }
}

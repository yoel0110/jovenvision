namespace JovenVision.Application.DTOs.Event
{
    public class EventResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string? Location { get; set; }
        public int Capacity { get; set; }
        public int GroupId { get; set; }
    }
}

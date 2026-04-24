using JovenVision.Application.DTOs.Event;

namespace JovenVision.Application.DTOs.Attendance
{
    public class AttendanceResponseDto
    {
        public int Id { get; set; }
        public int MemberId { get; set; }
        public int EventId { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime RegisteredAt { get; set; }
        public EventResponseDto? Event { get; set; }
    }
}

using System.Collections.Generic;

namespace JovenVision.Application.DTOs.Event
{
    public class EventPagedResponseDto
    {
        public IEnumerable<EventResponseDto> Data { get; set; } = new List<EventResponseDto>();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
    }
}

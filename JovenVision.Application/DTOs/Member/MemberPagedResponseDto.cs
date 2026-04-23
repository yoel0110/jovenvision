using System.Collections.Generic;

namespace JovenVision.Application.DTOs.Member
{
    public class MemberPagedResponseDto
    {
        public IEnumerable<MemberResponseDto> Data { get; set; } = new List<MemberResponseDto>();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
    }
}

using JovenVision.Application.DTOs.Member;
using JovenVision.Domain.Entities;

namespace JovenVision.Application.Services.Interfaces
{
    public interface IMemberService
    {
        Task<IEnumerable<Member>> GetAllAsync();
        Task<Member> GetByIdAsync(int id);
        Task AddAsync(Member member);
        Task UpdateAsync(Member member);
        Task DeleteAsync(int id);
        Task<IEnumerable<Member>> GetByStatusAsync(string status);
        Task<IEnumerable<Member>> GetByGroupAsync(int groupId);
        Task<IEnumerable<Attendance>> GetHistoryAsync(int memberId);
        Task<MemberPagedResponseDto> GetPagedAsync(int page, int pageSize, string? search = null, string? status = null, bool onlyWithoutUser = false, int? includeMemberId = null);
    }
}

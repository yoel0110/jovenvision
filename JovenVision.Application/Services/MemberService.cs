using JovenVision.Application.Common;
using JovenVision.Application.DTOs.Member;
using JovenVision.Application.Services.Interfaces;
using JovenVision.Domain.Entities;
using JovenVision.Infrastructure.Interfaces;

namespace JovenVision.Application.Services
{
    public class MemberService : IMemberService
    {
        private readonly IMemberRepository _memberRepository;

        public MemberService(IMemberRepository memberRepository)
        {
            _memberRepository = memberRepository;
        }

        private static MemberResponseDto ToDto(Member m) => new()
        {
            Id = m.Id,
            Name = m.Name,
            Email = m.Email,
            Phone = m.Phone,
            Status = m.Status
        };

        public Task<IEnumerable<Member>> GetAllAsync() =>
            _memberRepository.GetAllAsync();

        public async Task<Member> GetByIdAsync(int id)
        {
            var member = await _memberRepository.GetByIdAsync(id);
            if (member is null) throw new NotFoundException("Miembro", id);
            return member;
        }

        public Task AddAsync(Member member) =>
            _memberRepository.AddAsync(member);

        public async Task UpdateAsync(Member member)
        {
            var existing = await _memberRepository.GetByIdAsync(member.Id);
            if (existing is null) throw new NotFoundException("Miembro", member.Id);
            existing.Name = member.Name;
            existing.Email = member.Email;
            existing.Phone = member.Phone;
            existing.Status = member.Status;
            await _memberRepository.UpdateAsync(existing);
        }

        public async Task DeleteAsync(int id)
        {
            var existing = await _memberRepository.GetByIdAsync(id);
            if (existing is null) throw new NotFoundException("Miembro", id);
            await _memberRepository.DeleteAsync(id);
        }

        public Task<IEnumerable<Member>> GetByStatusAsync(string status) =>
            _memberRepository.GetByStatusAsync(status);

        public Task<IEnumerable<Member>> GetByGroupAsync(int groupId) =>
            _memberRepository.GetByGroupAsync(groupId);

        public Task<IEnumerable<Attendance>> GetHistoryAsync(int memberId) =>
            _memberRepository.GetHistoryAsync(memberId);

        public async Task<MemberPagedResponseDto> GetPagedAsync(int page, int pageSize, string? search = null, string? status = null)
        {
            var (items, totalCount) = await _memberRepository.GetPagedAsync(page, pageSize, search, status);

            return new MemberPagedResponseDto
            {
                Data = items.Select(ToDto),
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }
    }
}

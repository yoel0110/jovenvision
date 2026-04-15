using JovenVision.Application.Common;
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
            await _memberRepository.UpdateAsync(member);
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
    }
}

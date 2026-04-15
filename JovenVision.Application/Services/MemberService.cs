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

        public Task<IEnumerable<Member>> GetAllAsync() => _memberRepository.GetAllAsync();
        public Task<Member> GetByIdAsync(int id) => _memberRepository.GetByIdAsync(id);
        public Task AddAsync(Member member) => _memberRepository.AddAsync(member);
        public Task UpdateAsync(Member member) => _memberRepository.UpdateAsync(member);
        public Task DeleteAsync(int id) => _memberRepository.DeleteAsync(id);
        public Task<IEnumerable<Member>> GetByStatusAsync(string status) => _memberRepository.GetByStatusAsync(status);
        public Task<IEnumerable<Member>> GetByGroupAsync(int groupId) => _memberRepository.GetByGroupAsync(groupId);
        public Task<IEnumerable<Attendance>> GetHistoryAsync(int memberId) => _memberRepository.GetHistoryAsync(memberId);
    }
}

using JovenVision.Domain.Entities;

namespace JovenVision.Application.Services.Interfaces
{
    public interface IGroupService
    {
        Task<IEnumerable<Group>> GetAllAsync();
        Task<Group> GetByIdAsync(int id);
        Task AddAsync(Group group);
        Task UpdateAsync(Group group);
        Task DeleteAsync(int id);
        Task<IEnumerable<Member>> GetMembersAsync(int groupId);
        Task AddMemberAsync(int groupId, int memberId);
        Task RemoveMemberAsync(int groupId, int memberId);
    }
}

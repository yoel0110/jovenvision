using JovenVision.Application.Services.Interfaces;
using JovenVision.Domain.Entities;
using JovenVision.Infrastructure.Interfaces;

namespace JovenVision.Application.Services
{
    public class GroupService : IGroupService
    {
        private readonly IGroupRepository _groupRepository;

        public GroupService(IGroupRepository groupRepository)
        {
            _groupRepository = groupRepository;
        }

        public Task<IEnumerable<Group>> GetAllAsync() =>
            _groupRepository.GetAllAsync();

        public Task<Group> GetByIdAsync(int id) =>
            _groupRepository.GetByIdAsync(id);

        public Task AddAsync(Group group) =>
            _groupRepository.AddAsync(group);

        public Task UpdateAsync(Group group) =>
            _groupRepository.UpdateAsync(group);

        public Task DeleteAsync(int id) =>
            _groupRepository.DeleteAsync(id);

        public Task<IEnumerable<Member>> GetMembersAsync(int groupId) =>
            _groupRepository.GetMembersAsync(groupId);

        public Task AddMemberAsync(int groupId, int memberId) =>
            _groupRepository.AddMemberAsync(groupId, memberId);

        public Task RemoveMemberAsync(int groupId, int memberId) =>
            _groupRepository.RemoveMemberAsync(groupId, memberId);
    }
}

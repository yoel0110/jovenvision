using JovenVision.Application.Common;
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

        public async Task<Group> GetByIdAsync(int id)
        {
            var group = await _groupRepository.GetByIdAsync(id);
            if (group is null) throw new NotFoundException("Grupo", id);
            return group;
        }

        public Task AddAsync(Group group) =>
            _groupRepository.AddAsync(group);

        public async Task UpdateAsync(Group group)
        {
            var existing = await _groupRepository.GetByIdAsync(group.Id);
            if (existing is null) throw new NotFoundException("Grupo", group.Id);
            existing.Name = group.Name;
            existing.Description = group.Description;
            existing.Capacity = group.Capacity;
            await _groupRepository.UpdateAsync(existing);
        }

        public async Task DeleteAsync(int id)
        {
            var existing = await _groupRepository.GetByIdAsync(id);
            if (existing is null) throw new NotFoundException("Grupo", id);
            await _groupRepository.DeleteAsync(id);
        }

        public Task<IEnumerable<GroupMember>> GetMembersAsync(int groupId) =>
            _groupRepository.GetMembersAsync(groupId);

        public Task AddMemberAsync(int groupId, int memberId, string role) =>
            _groupRepository.AddMemberAsync(groupId, memberId, role);

        public Task RemoveMemberAsync(int groupId, int memberId) =>
            _groupRepository.RemoveMemberAsync(groupId, memberId);
    }
}

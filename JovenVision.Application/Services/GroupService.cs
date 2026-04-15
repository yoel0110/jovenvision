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
            await _groupRepository.UpdateAsync(group);
        }

        public async Task DeleteAsync(int id)
        {
            var existing = await _groupRepository.GetByIdAsync(id);
            if (existing is null) throw new NotFoundException("Grupo", id);
            await _groupRepository.DeleteAsync(id);
        }

        public Task<IEnumerable<Member>> GetMembersAsync(int groupId) =>
            _groupRepository.GetMembersAsync(groupId);

        public Task AddMemberAsync(int groupId, int memberId) =>
            _groupRepository.AddMemberAsync(groupId, memberId);

        public Task RemoveMemberAsync(int groupId, int memberId) =>
            _groupRepository.RemoveMemberAsync(groupId, memberId);
    }
}

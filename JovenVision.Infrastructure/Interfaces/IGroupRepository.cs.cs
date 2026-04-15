using JovenVision.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace JovenVision.Infrastructure.Interfaces
{
    public interface IGroupRepository : IRepository<Group>
    {
        Task<IEnumerable<Member>> GetMembersAsync(int groupId);
        Task AddMemberAsync(int groupId, int memberId);
        Task RemoveMemberAsync(int groupId, int memberId);
    }
}

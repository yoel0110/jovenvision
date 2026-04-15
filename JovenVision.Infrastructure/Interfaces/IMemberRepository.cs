using JovenVision.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace JovenVision.Infrastructure.Interfaces
{
    public interface IMemberRepository : IRepository<Member>
    {
        Task<IEnumerable<Member>> GetByStatusAsync(string status);
        Task<IEnumerable<Member>> GetByGroupAsync(int groupId);
        Task<IEnumerable<Attendance>> GetHistoryAsync(int memberId);
    }
}

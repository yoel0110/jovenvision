using JovenVision.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace JovenVision.Infrastructure.Interfaces
{
    public interface ITrackingRepository : IRepository<Tracking>
    {
        Task<IEnumerable<Tracking>> GetByMemberAsync(int memberId);
    }
}

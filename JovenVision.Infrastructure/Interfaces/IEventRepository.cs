using JovenVision.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;


namespace JovenVision.Infrastructure.Interfaces
{
    public interface IEventRepository : IRepository<Event>
    {
        Task<IEnumerable<Event>> GetByGroupAsync(int groupId);
        Task<IEnumerable<Event>> GetUpcomingAsync();
    }
}

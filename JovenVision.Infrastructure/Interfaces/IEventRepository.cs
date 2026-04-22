using JovenVision.Domain.Entities;
namespace JovenVision.Infrastructure.Interfaces
{
    public interface IEventRepository : IRepository<Event>
    {
        Task<IEnumerable<Event>> GetByGroupAsync(int groupId);
        Task<IEnumerable<Event>> GetUpcomingAsync();
    }
}

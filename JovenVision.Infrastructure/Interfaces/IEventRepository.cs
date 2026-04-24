using JovenVision.Domain.Entities;
namespace JovenVision.Infrastructure.Interfaces
{
    public interface IEventRepository : IRepository<Event>
    {
        Task<IEnumerable<Event>> GetByGroupAsync(int groupId);
        Task<IEnumerable<Event>> GetUpcomingAsync();
        Task<(IEnumerable<Event> Items, int TotalCount)> GetPagedAsync(int page, int pageSize, string? title = null, string? type = null, string? status = null, DateTime? startDate = null, DateTime? endDate = null);
    }
}

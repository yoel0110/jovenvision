using JovenVision.Application.DTOs.Event;
using JovenVision.Domain.Entities;

namespace JovenVision.Application.Services.Interfaces
{
    public interface IEventService
    {
        Task<IEnumerable<Event>> GetAllAsync();
        Task<Event> GetByIdAsync(int id);
        Task AddAsync(Event eventEntity);
        Task UpdateAsync(Event eventEntity);
        Task DeleteAsync(int id);
        Task<IEnumerable<Event>> GetByGroupAsync(int groupId);
        Task<IEnumerable<Event>> GetUpcomingAsync();
        Task<EventPagedResponseDto> GetPagedAsync(int page, int pageSize, string? title = null, string? type = null, string? status = null, DateTime? startDate = null, DateTime? endDate = null);
    }
}

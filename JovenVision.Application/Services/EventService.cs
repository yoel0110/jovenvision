using JovenVision.Application.Services.Interfaces;
using JovenVision.Domain.Entities;
using JovenVision.Infrastructure.Interfaces;

namespace JovenVision.Application.Services
{
    public class EventService : IEventService
    {
        private readonly IEventRepository _eventRepository;

        public EventService(IEventRepository eventRepository)
        {
            _eventRepository = eventRepository;
        }

        public Task<IEnumerable<Event>> GetAllAsync() => _eventRepository.GetAllAsync();
        public Task<Event> GetByIdAsync(int id) => _eventRepository.GetByIdAsync(id);
        public Task AddAsync(Event eventEntity) => _eventRepository.AddAsync(eventEntity);
        public Task UpdateAsync(Event eventEntity) => _eventRepository.UpdateAsync(eventEntity);
        public Task DeleteAsync(int id) => _eventRepository.DeleteAsync(id);
        public Task<IEnumerable<Event>> GetByGroupAsync(int groupId) => _eventRepository.GetByGroupAsync(groupId);
        public Task<IEnumerable<Event>> GetUpcomingAsync() => _eventRepository.GetUpcomingAsync();
    }
}

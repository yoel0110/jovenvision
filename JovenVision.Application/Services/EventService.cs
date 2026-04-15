using JovenVision.Application.Common;
using JovenVision.Application.Services.Interfaces;
using JovenVision.Domain.Entities;
using JovenVision.Infrastructure.Interfaces;

namespace JovenVision.Application.Services
{
    public class EventService : IEventService
    {
        private readonly IEventRepository _eventRepository;
        private readonly IGroupRepository _groupRepository;

        public EventService(IEventRepository eventRepository, IGroupRepository groupRepository)
        {
            _eventRepository = eventRepository;
            _groupRepository = groupRepository;
        }

        public Task<IEnumerable<Event>> GetAllAsync() =>
            _eventRepository.GetAllAsync();

        public async Task<Event> GetByIdAsync(int id)
        {
            var ev = await _eventRepository.GetByIdAsync(id);
            if (ev is null) throw new NotFoundException("Evento", id);
            return ev;
        }

        public async Task AddAsync(Event eventEntity)
        {
            var group = await _groupRepository.GetByIdAsync(eventEntity.GroupId);
            if (group is null) throw new NotFoundException("Grupo", eventEntity.GroupId);
            await _eventRepository.AddAsync(eventEntity);
        }

        public async Task UpdateAsync(Event eventEntity)
        {
            var existing = await _eventRepository.GetByIdAsync(eventEntity.Id);
            if (existing is null) throw new NotFoundException("Evento", eventEntity.Id);
            var group = await _groupRepository.GetByIdAsync(eventEntity.GroupId);
            if (group is null) throw new NotFoundException("Grupo", eventEntity.GroupId);
            await _eventRepository.UpdateAsync(eventEntity);
        }

        public async Task DeleteAsync(int id)
        {
            var existing = await _eventRepository.GetByIdAsync(id);
            if (existing is null) throw new NotFoundException("Evento", id);
            await _eventRepository.DeleteAsync(id);
        }

        public Task<IEnumerable<Event>> GetByGroupAsync(int groupId) =>
            _eventRepository.GetByGroupAsync(groupId);

        public Task<IEnumerable<Event>> GetUpcomingAsync() =>
            _eventRepository.GetUpcomingAsync();
    }
}

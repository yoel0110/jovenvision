using JovenVision.Application.Common;
using JovenVision.Application.DTOs.Event;
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
            if (eventEntity.GroupId.HasValue)
            {
                var group = await _groupRepository.GetByIdAsync(eventEntity.GroupId.Value);
                if (group is null) throw new NotFoundException("Grupo", eventEntity.GroupId.Value);
            }
            await _eventRepository.AddAsync(eventEntity);
        }

        public async Task UpdateAsync(Event eventEntity)
        {
            var existing = await _eventRepository.GetByIdAsync(eventEntity.Id);
            if (existing is null) throw new NotFoundException("Evento", eventEntity.Id);

            if (eventEntity.GroupId.HasValue)
            {
                var group = await _groupRepository.GetByIdAsync(eventEntity.GroupId.Value);
                if (group is null) throw new NotFoundException("Grupo", eventEntity.GroupId.Value);
            }

            existing.Title = eventEntity.Title;
            existing.Type = eventEntity.Type;
            existing.Date = eventEntity.Date;
            existing.Location = eventEntity.Location;
            existing.Capacity = eventEntity.Capacity;
            existing.GroupId = eventEntity.GroupId;
            existing.Status = eventEntity.Status;
            await _eventRepository.UpdateAsync(existing);
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

        public async Task<EventPagedResponseDto> GetPagedAsync(
            int page, 
            int pageSize, 
            string? title = null, 
            string? type = null, 
            string? status = null, 
            DateTime? startDate = null, 
            DateTime? endDate = null)
        {
            var (items, totalCount) = await _eventRepository.GetPagedAsync(page, pageSize, title, type, status, startDate, endDate);

            return new EventPagedResponseDto
            {
                Data = items.Select(e => new EventResponseDto
                {
                    Id = e.Id,
                    Title = e.Title,
                    Type = e.Type,
                    Date = e.Date,
                    Location = e.Location,
                    Capacity = e.Capacity,
                    Status = e.Status,
                    GroupId = e.GroupId,
                    Group = e.Group != null ? new GroupSummaryDto { Id = e.Group.Id, Name = e.Group.Name } : null
                }),
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }
    }
}

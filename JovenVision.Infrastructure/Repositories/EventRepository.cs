using JovenVision.Domain.Entities;
using JovenVision.Infrastructure.Context;
using JovenVision.Infrastructure.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JovenVision.Infrastructure.Repositories
{
    public class EventRepository : IEventRepository
    {
        private readonly JovenVisionDbContext _context;

        public EventRepository(JovenVisionDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Event entity)
        {
            _context.Events.Add(entity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            _context.Events.Remove(new Event { Id = id });
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Event>> GetAllAsync()
        {
            return await _context.Events.ToListAsync();
        }

        public async Task<IEnumerable<Event>> GetByGroupAsync(int groupId)
        {
            return await _context.Events
                .Where(e => e.GroupId == groupId)
                .ToListAsync();
        }

        public async Task<Event> GetByIdAsync(int id)
        {
            return await _context.Events.FindAsync(id);
        }

        public async Task<IEnumerable<Event>> GetUpcomingAsync()
        {
            return await _context.Events
                .Where(e => e.Date > DateTime.Now)
                .ToListAsync();
        }

        public async Task UpdateAsync(Event entity)
        {
            _context.Events.Update(entity);
            await _context.SaveChangesAsync();
        }
    }
}

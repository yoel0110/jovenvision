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
            var entity = await _context.Events.FindAsync(id);
            if (entity is not null)
            {
                _context.Events.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Event>> GetAllAsync()
        {
            return await _context.Events
                .Include(e => e.Group)
                .ToListAsync();
        }

        public async Task<IEnumerable<Event>> GetByGroupAsync(int groupId)
        {
            return await _context.Events
                .Include(e => e.Group)
                .Where(e => e.GroupId == groupId)
                .ToListAsync();
        }

        public async Task<Event> GetByIdAsync(int id)
        {
            return await _context.Events
                .Include(e => e.Group)
                .FirstOrDefaultAsync(e => e.Id == id);
        }

    public async Task<IEnumerable<Event>> GetUpcomingAsync()
        {
            return await _context.Events
                .Include(e => e.Group)
                .Where(e => e.Date > DateTime.Now)
                .ToListAsync();
        }

        public async Task UpdateAsync(Event entity)
        {
            _context.Events.Update(entity);
            await _context.SaveChangesAsync();
        }

        public async Task<(IEnumerable<Event> Items, int TotalCount)> GetPagedAsync(
            int page, 
            int pageSize, 
            string? title = null, 
            string? type = null, 
            string? status = null, 
            DateTime? startDate = null, 
            DateTime? endDate = null)
        {
            var query = _context.Events
                .Include(e => e.Group)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(title))
                query = query.Where(e => e.Title.Contains(title));

            if (!string.IsNullOrWhiteSpace(type))
                query = query.Where(e => e.Type == type);

            if (!string.IsNullOrWhiteSpace(status))
                query = query.Where(e => e.Status == status);

            if (startDate.HasValue)
                query = query.Where(e => e.Date >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(e => e.Date <= endDate.Value);

            var totalCount = await query.CountAsync();
            var items = await query
                .OrderByDescending(e => e.Date)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }
    }
}

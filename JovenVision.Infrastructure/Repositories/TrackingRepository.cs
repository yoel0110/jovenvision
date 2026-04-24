using JovenVision.Domain.Entities;
using JovenVision.Infrastructure.Context;
using JovenVision.Infrastructure.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JovenVision.Infrastructure.Repositories
{
    public class TrackingRepository : ITrackingRepository
    {
        private readonly JovenVisionDbContext _context;

        public TrackingRepository(JovenVisionDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Tracking entity)
        {
            _context.Tracking.Add(entity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _context.Tracking.FindAsync(id);
            if (entity is not null)
            {
                _context.Tracking.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Tracking>> GetAllAsync()
        {
            return await _context.Tracking
                .Include(t => t.Responsible)
                .ToListAsync();
        }

        public async Task<Tracking?> GetByIdAsync(int id)
        {
            return await _context.Tracking
                .Include(t => t.Responsible)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<IEnumerable<Tracking>> GetByMemberAsync(int memberId)
        {
            return await _context.Tracking
                .Include(t => t.Responsible)
                .Where(t => t.MemberId == memberId)
                .OrderByDescending(t => t.Date)
                .ToListAsync();
        }

        public async Task UpdateAsync(Tracking entity)
        {
            _context.Tracking.Update(entity);
            await _context.SaveChangesAsync();
        }
    }
}

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
            _context.Tracking.Remove(new Tracking { Id = id });
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Tracking>> GetAllAsync()
        {
            return await _context.Tracking.ToListAsync();
        }

        public async Task<Tracking> GetByIdAsync(int id)
        {
            return await _context.Tracking.FindAsync(id);
        }

        public async Task<IEnumerable<Tracking>> GetByMemberAsync(int memberId)
        {
            // Usamos await y la versión Async.
            // El hilo queda libre para otras tareas mientras la DB trabaja.
            return await _context.Tracking
                .Where(t => t.MemberId == memberId)
                .ToListAsync();
        }

        public async Task UpdateAsync(Tracking entity)
        {
            _context.Tracking.Update(entity);
            await _context.SaveChangesAsync();
        }
    }
}

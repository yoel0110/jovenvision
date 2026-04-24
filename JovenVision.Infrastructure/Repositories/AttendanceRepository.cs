using JovenVision.Domain.Entities;
using JovenVision.Infrastructure.Context;
using JovenVision.Infrastructure.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JovenVision.Infrastructure.Repositories
{
    public class AttendanceRepository : IAttendanceRepository
    {
        private readonly JovenVisionDbContext _context;

        public AttendanceRepository(JovenVisionDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Attendance entity)
        {
            _context.Attendances.Add(entity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _context.Attendances.FindAsync(id);
            if (entity is not null)
            {
                _context.Attendances.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Attendance>> GetAllAsync()
        {
            return await _context.Attendances
                .Include(a => a.Event)
                .ToListAsync();
        }

        public async Task<Attendance> GetByIdAsync(int id)
        {
            return await _context.Attendances.FindAsync(id);
        }

        public async Task<IEnumerable<Attendance>> GetByEventAsync(int eventId)
        {
            return await _context.Attendances
                .Include(a => a.Event)
                .Where(a => a.EventId == eventId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Attendance>> GetByMemberAsync(int memberId)
        {
            return await _context.Attendances
                .Include(a => a.Event)
                .Where(a => a.MemberId == memberId)
                .OrderByDescending(a => a.RegisteredAt)
                .ToListAsync();
        }

        public Task<bool> ExistsAsync(int memberId, int eventId)
        {
            return _context.Attendances
                .AnyAsync(a => a.MemberId == memberId && a.EventId == eventId);
        }

        public async Task UpdateAsync(Attendance entity)
        {
            _context.Attendances.Update(entity);
            await _context.SaveChangesAsync();
        }

        public async Task<int> GetAttendeesCountAsync()
        {
            var totalAttendees = await _context.Attendances.Where(a => a.Status == "Present").CountAsync();
            return totalAttendees;
        }
    }
}

using JovenVision.Domain.Entities;
using JovenVision.Infrastructure.Context;
using JovenVision.Infrastructure.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JovenVision.Infrastructure.Repositories
{
    public class MemberRepository : IMemberRepository
    {
        private readonly JovenVisionDbContext _context;

        public MemberRepository(JovenVisionDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Member entity)
        {
            _context.Members.Add(entity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            _context.Members.Remove(new Member { Id = id });
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Member>> GetAllAsync()
        {
            return await _context.Members.ToListAsync();
        }

        public async Task<IEnumerable<Member>> GetByGroupAsync(int groupId)
        {
            return await _context.Members
                .Where(m => m.Groups.Any(g => g.Id == groupId))
                .ToListAsync();
        }

        public async Task<Member> GetByIdAsync(int id)
        {
            return await _context.Members.FindAsync(id);
        }

        public async Task<IEnumerable<Member>> GetByStatusAsync(string status)
        {
            return await _context.Members
                .Where(m => m.Status == status)
                .ToListAsync();
        }

        public async Task<IEnumerable<Attendance>> GetHistoryAsync(int memberId)
        {
            return await _context.Attendances
                .Where(a => a.MemberId == memberId)
                .ToListAsync();
        }

        public async Task UpdateAsync(Member entity)
        {
            _context.Members.Update(entity);
            await _context.SaveChangesAsync();
        }
    }
}

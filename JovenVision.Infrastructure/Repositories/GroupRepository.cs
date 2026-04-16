using JovenVision.Domain.Entities;
using JovenVision.Infrastructure.Context;
using JovenVision.Infrastructure.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JovenVision.Infrastructure.Repositories
{
    public class GroupRepository : IGroupRepository
    {
        private readonly JovenVisionDbContext _context;

        public GroupRepository(JovenVisionDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Group entity)
        {
            _context.Groups.Add(entity);
            await _context.SaveChangesAsync();
        }

        public async Task AddMemberAsync(int groupId, int memberId)
        {
            var group = await _context.Groups.FindAsync(groupId);
            var member = await _context.Members.FindAsync(memberId);
            if (group != null && member != null)
            {
                group.Members.Add(member);
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _context.Groups.FindAsync(id);
            if (entity is not null)
            {
                _context.Groups.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Group>> GetAllAsync()
        {
            return await _context.Groups.ToListAsync();
        }

        public async Task<Group> GetByIdAsync(int id)
        {
            return await _context.Groups.FindAsync(id);
        }

        public async Task<IEnumerable<Member>> GetMembersAsync(int groupId)
        {
            var group = await _context.Groups
                .Include(g => g.Members)
                .FirstOrDefaultAsync(g => g.Id == groupId);

            if (group != null)
                return group.Members.ToList();

            return new List<Member>();
        }

        public async Task RemoveMemberAsync(int groupId, int memberId)
        {
            var group = await _context.Groups
                .Include(g => g.Members)
                .FirstOrDefaultAsync(g => g.Id == groupId);
            var member = await _context.Members.FindAsync(memberId);
            if (group != null && member != null)
            {
                group.Members.Remove(member);
                await _context.SaveChangesAsync();
            }
        }

        public async Task UpdateAsync(Group entity)
        {
            _context.Groups.Update(entity);
            await _context.SaveChangesAsync();
        }
    }
}

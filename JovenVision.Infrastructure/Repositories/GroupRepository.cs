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

        public async Task AddMemberAsync(int groupId, int memberId, string role)
        {
            var exists = await _context.GroupMembers.AnyAsync(gm => gm.GroupId == groupId && gm.MemberId == memberId);
            if (!exists)
            {
                _context.GroupMembers.Add(new GroupMember { GroupId = groupId, MemberId = memberId, Role = role });
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
            return await _context.Groups.Include(g => g.GroupMembers).ToListAsync();
        }

        public async Task<Group> GetByIdAsync(int id)
        {
            return await _context.Groups.FindAsync(id);
        }

        public async Task<IEnumerable<GroupMember>> GetMembersAsync(int groupId)
        {
            return await _context.GroupMembers
                .Include(gm => gm.Member)
                .Where(gm => gm.GroupId == groupId)
                .ToListAsync();
        }

        public async Task RemoveMemberAsync(int groupId, int memberId)
        {
            var gm = await _context.GroupMembers.FirstOrDefaultAsync(g => g.GroupId == groupId && g.MemberId == memberId);
            if (gm != null)
            {
                _context.GroupMembers.Remove(gm);
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

using JovenVision.Domain.Entities;
using JovenVision.Infrastructure.Context;
using JovenVision.Infrastructure.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JovenVision.Infrastructure.Repositories
{
    public class RoleRepository : IRoleRepository
    {
        private readonly JovenVisionDbContext _context;

        public RoleRepository(JovenVisionDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Role entity)
        {
            _context.Roles.Add(entity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            _context.Roles.Remove(new Role { Id = id });
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Role>> GetAllAsync()
        {
            return await _context.Roles.ToListAsync();
        }

        public async Task<Role> GetByIdAsync(int id)
        {
            return await _context.Roles.FindAsync(id);
        }

        public async Task<Role> GetByNameAsync(string name)
        {
            return await _context.Roles.FirstOrDefaultAsync(r => r.Name == name);
        }

        public async Task UpdateAsync(Role entity)
        {
            _context.Roles.Update(entity);
            await _context.SaveChangesAsync();
        }
    }
}

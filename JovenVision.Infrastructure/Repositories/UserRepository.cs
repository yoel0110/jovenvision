using JovenVision.Domain.Entities;
using JovenVision.Infrastructure.Context;
using JovenVision.Infrastructure.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JovenVision.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly JovenVisionDbContext _context;

        public UserRepository(JovenVisionDbContext context)
        {
            _context = context;
        }

        async Task IRepository<User>.AddAsync(User entity)
        {
            _context.Users.Add(entity);
            await _context.SaveChangesAsync();
        }

        async Task IRepository<User>.DeleteAsync(int id)
        {
            var entity = await _context.Users.FindAsync(id);
            if (entity is not null)
            {
                _context.Users.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }

        Task<bool> IUserRepository.ExistsAsync(string username)
        {
            return _context.Users.AnyAsync(u => u.Username == username);
        }

        async Task<IEnumerable<User>> IRepository<User>.GetAllAsync()
        {
            return await _context.Users.ToListAsync();
        }

        async Task<User> IRepository<User>.GetByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        async Task<User> IUserRepository.GetByUsernameAsync(string username)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        }

        async Task IRepository<User>.UpdateAsync(User entity)
        {
            _context.Users.Update(entity);
            await _context.SaveChangesAsync();
        }
    }
}

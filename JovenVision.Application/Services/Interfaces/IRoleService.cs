using JovenVision.Domain.Entities;

namespace JovenVision.Application.Services.Interfaces
{
    public interface IRoleService
    {
        Task<IEnumerable<Role>> GetAllAsync();
        Task<Role> GetByIdAsync(int id);
        Task AddAsync(Role role);
        Task UpdateAsync(Role role);
        Task DeleteAsync(int id);
        Task<Role> GetByNameAsync(string name);
    }
}

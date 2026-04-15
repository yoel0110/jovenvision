using JovenVision.Application.Services.Interfaces;
using JovenVision.Domain.Entities;
using JovenVision.Infrastructure.Interfaces;

namespace JovenVision.Application.Services
{
    public class RoleService : IRoleService
    {
        private readonly IRoleRepository _roleRepository;

        public RoleService(IRoleRepository roleRepository)
        {
            _roleRepository = roleRepository;
        }

        public Task<IEnumerable<Role>> GetAllAsync() =>
            _roleRepository.GetAllAsync();

        public Task<Role> GetByIdAsync(int id) =>
            _roleRepository.GetByIdAsync(id);

        public Task AddAsync(Role role) =>
            _roleRepository.AddAsync(role);

        public Task UpdateAsync(Role role) =>
            _roleRepository.UpdateAsync(role);

        public Task DeleteAsync(int id) =>
            _roleRepository.DeleteAsync(id);

        public Task<Role> GetByNameAsync(string name) =>
            _roleRepository.GetByNameAsync(name);
    }
}

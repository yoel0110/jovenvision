using JovenVision.Application.Common;
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

        public async Task<Role> GetByIdAsync(int id)
        {
            var role = await _roleRepository.GetByIdAsync(id);
            if (role is null) throw new NotFoundException("Rol", id);
            return role;
        }

        public Task AddAsync(Role role) =>
            _roleRepository.AddAsync(role);

        public async Task UpdateAsync(Role role)
        {
            var existing = await _roleRepository.GetByIdAsync(role.Id);
            if (existing is null) throw new NotFoundException("Rol", role.Id);
            existing.Name = role.Name;
            await _roleRepository.UpdateAsync(existing);
        }

        public async Task DeleteAsync(int id)
        {
            var existing = await _roleRepository.GetByIdAsync(id);
            if (existing is null) throw new NotFoundException("Rol", id);
            await _roleRepository.DeleteAsync(id);
        }

        public Task<Role> GetByNameAsync(string name) =>
            _roleRepository.GetByNameAsync(name);
    }
}

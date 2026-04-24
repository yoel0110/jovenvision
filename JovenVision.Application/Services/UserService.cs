using JovenVision.Application.Common;
using JovenVision.Application.Services.Interfaces;
using JovenVision.Domain.Entities;
using JovenVision.Infrastructure.Interfaces;

namespace JovenVision.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public Task<IEnumerable<User>> GetAllAsync() =>
            _userRepository.GetAllAsync();

        public async Task<User> GetByIdAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user is null) throw new NotFoundException("Usuario", id);
            return user;
        }

        public Task AddAsync(User user) =>
            _userRepository.AddAsync(user);

        public async Task UpdateAsync(User user)
        {
            var existing = await _userRepository.GetByIdAsync(user.Id);
            if (existing is null) throw new NotFoundException("Usuario", user.Id);
            existing.Username = user.Username;
            existing.PasswordHash = user.PasswordHash;
            existing.RoleId = user.RoleId;
            existing.MemberId = user.MemberId;
            await _userRepository.UpdateAsync(existing);
        }

        public async Task DeleteAsync(int id)
        {
            var existing = await _userRepository.GetByIdAsync(id);
            if (existing is null) throw new NotFoundException("Usuario", id);
            await _userRepository.DeleteAsync(id);
        }

        public Task<User> GetByUsernameAsync(string username) =>
            _userRepository.GetByUsernameAsync(username);

        public Task<User> GetByEmailAsync(string email) =>
            _userRepository.GetByEmailAsync(email);

        public Task<bool> ExistsAsync(string username) =>
            _userRepository.ExistsAsync(username);
    }
}

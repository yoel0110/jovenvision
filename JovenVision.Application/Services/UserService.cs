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

        public Task<User> GetByIdAsync(int id) =>
            _userRepository.GetByIdAsync(id);

        public Task AddAsync(User user) =>
            _userRepository.AddAsync(user);

        public Task UpdateAsync(User user) =>
            _userRepository.UpdateAsync(user);

        public Task DeleteAsync(int id) =>
            _userRepository.DeleteAsync(id);

        public Task<User> GetByUsernameAsync(string username) =>
            _userRepository.GetByUsernameAsync(username);

        public Task<bool> ExistsAsync(string username) =>
            _userRepository.ExistsAsync(username);
    }
}

using JovenVision.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace JovenVision.Infrastructure.Interfaces
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User> GetByUsernameAsync(string username);
        Task<User> GetByEmailAsync(string email);
        Task<bool> ExistsAsync(string username);
        Task<int> GetAllUsersCount();
        Task<int> GetActiveUsersCount();

    }
}

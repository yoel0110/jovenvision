using JovenVision.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace JovenVision.Infrastructure.Interfaces
{
    public interface IRoleRepository : IRepository<Role>
    {
        Task<Role> GetByNameAsync(string name);
    }
}

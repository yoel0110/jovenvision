using JovenVision.Domain.Entities;

namespace JovenVision.Api.Services
{
    public interface IJwtService
    {
        string GenerateToken(User user, string roleName);
    }
}

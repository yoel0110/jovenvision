using JovenVision.Domain.Entities;

namespace JovenVision.Application.Services.Interfaces
{
    public interface ITrackingService
    {
        Task<IEnumerable<Tracking>> GetAllAsync();
        Task<Tracking> GetByIdAsync(int id);
        Task AddAsync(Tracking tracking);
        Task UpdateAsync(Tracking tracking);
        Task DeleteAsync(int id);
        Task<IEnumerable<Tracking>> GetByMemberAsync(int memberId);
    }
}

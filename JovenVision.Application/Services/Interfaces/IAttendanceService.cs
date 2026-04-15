using JovenVision.Domain.Entities;

namespace JovenVision.Application.Services.Interfaces
{
    public interface IAttendanceService
    {
        Task<IEnumerable<Attendance>> GetAllAsync();
        Task<Attendance> GetByIdAsync(int id);
        Task RegisterAsync(Attendance attendance);
        Task UpdateAsync(Attendance attendance);
        Task DeleteAsync(int id);
        Task<IEnumerable<Attendance>> GetByEventAsync(int eventId);
        Task<IEnumerable<Attendance>> GetByMemberAsync(int memberId);
        Task<bool> ExistsAsync(int memberId, int eventId);
    }
}

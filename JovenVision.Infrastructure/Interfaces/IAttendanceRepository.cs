using JovenVision.Domain.Entities;

namespace JovenVision.Infrastructure.Interfaces
{
    public interface IAttendanceRepository : IRepository<Attendance>
    {
        Task<IEnumerable<Attendance>> GetByEventAsync(int eventId);
        Task<IEnumerable<Attendance>> GetByMemberAsync(int memberId);
        Task<bool> ExistsAsync(int memberId, int eventId);
        Task<int> GetAttendeesCountAsync();

    }
}

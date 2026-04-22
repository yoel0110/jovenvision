
using JovenVision.Application.Services.Interfaces;
using JovenVision.Domain.Entities;
using JovenVision.Infrastructure.Interfaces;

namespace JovenVision.Application.Services
{
  public class MetricsService : IMetricsService
  {

    private readonly IAttendanceRepository _attendanceRepository;
    private readonly IUserRepository _userRepository;

    public MetricsService(IAttendanceRepository attendanceRepository, IUserRepository userRepository)
    {
      _attendanceRepository = attendanceRepository;
      _userRepository = userRepository;
    }
    public async Task<Metrics> GetMetrics()
    {
      var totalUsers = await _userRepository.GetAllUsersCount();
      var activeUsers = await _userRepository.GetActiveUsersCount();
      var totalAttendees = await _attendanceRepository.GetAttendeesCountAsync();

      return new Metrics
      {
        TotalUsers = totalUsers,
        ActiveUsers = activeUsers,
      
      };
    }
  }
}
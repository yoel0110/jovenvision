using JovenVision.Application.Services.Interfaces;
using JovenVision.Domain.Entities;
using JovenVision.Infrastructure.Interfaces;

namespace JovenVision.Application.Services
{
    public class AttendanceService : IAttendanceService
    {
        private readonly IAttendanceRepository _attendanceRepository;

        public AttendanceService(IAttendanceRepository attendanceRepository)
        {
            _attendanceRepository = attendanceRepository;
        }

        public Task<IEnumerable<Attendance>> GetAllAsync() =>
            _attendanceRepository.GetAllAsync();

        public Task<Attendance> GetByIdAsync(int id) =>
            _attendanceRepository.GetByIdAsync(id);

        public async Task RegisterAsync(Attendance attendance)
        {
            bool alreadyExists = await _attendanceRepository.ExistsAsync(attendance.MemberId, attendance.EventId);
            if (alreadyExists)
                throw new InvalidOperationException("El miembro ya tiene asistencia registrada para este evento.");

            await _attendanceRepository.AddAsync(attendance);
        }

        public Task UpdateAsync(Attendance attendance) =>
            _attendanceRepository.UpdateAsync(attendance);

        public Task DeleteAsync(int id) =>
            _attendanceRepository.DeleteAsync(id);

        public Task<IEnumerable<Attendance>> GetByEventAsync(int eventId) =>
            _attendanceRepository.GetByEventAsync(eventId);

        public Task<IEnumerable<Attendance>> GetByMemberAsync(int memberId) =>
            _attendanceRepository.GetByMemberAsync(memberId);

        public Task<bool> ExistsAsync(int memberId, int eventId) =>
            _attendanceRepository.ExistsAsync(memberId, eventId);
    }
}

using JovenVision.Application.Common;
using JovenVision.Application.Services.Interfaces;
using JovenVision.Domain.Entities;
using JovenVision.Infrastructure.Interfaces;

namespace JovenVision.Application.Services
{
    public class AttendanceService : IAttendanceService
    {
        private readonly IAttendanceRepository _attendanceRepository;
        private readonly IMemberRepository _memberRepository;
        private readonly IEventRepository _eventRepository;

        public AttendanceService(IAttendanceRepository attendanceRepository,
            IMemberRepository memberRepository, IEventRepository eventRepository)
        {
            _attendanceRepository = attendanceRepository;
            _memberRepository = memberRepository;
            _eventRepository = eventRepository;
        }

        public Task<IEnumerable<Attendance>> GetAllAsync() =>
            _attendanceRepository.GetAllAsync();

        public async Task<Attendance> GetByIdAsync(int id)
        {
            var attendance = await _attendanceRepository.GetByIdAsync(id);
            if (attendance is null) throw new NotFoundException("Asistencia", id);
            return attendance;
        }

        public async Task RegisterAsync(Attendance attendance)
        {
            var member = await _memberRepository.GetByIdAsync(attendance.MemberId);
            if (member is null) throw new NotFoundException("Miembro", attendance.MemberId);

            var ev = await _eventRepository.GetByIdAsync(attendance.EventId);
            if (ev is null) throw new NotFoundException("Evento", attendance.EventId);

            bool alreadyExists = await _attendanceRepository.ExistsAsync(attendance.MemberId, attendance.EventId);
            if (alreadyExists)
                throw new InvalidOperationException("El miembro ya tiene asistencia registrada para este evento.");

            await _attendanceRepository.AddAsync(attendance);
        }

        public async Task UpdateAsync(Attendance attendance)
        {
            var existing = await _attendanceRepository.GetByIdAsync(attendance.Id);
            if (existing is null) throw new NotFoundException("Asistencia", attendance.Id);
            existing.MemberId = attendance.MemberId;
            existing.EventId = attendance.EventId;
            existing.Status = attendance.Status;
            await _attendanceRepository.UpdateAsync(existing);
        }

        public async Task DeleteAsync(int id)
        {
            var existing = await _attendanceRepository.GetByIdAsync(id);
            if (existing is null) throw new NotFoundException("Asistencia", id);
            await _attendanceRepository.DeleteAsync(id);
        }

        public Task<IEnumerable<Attendance>> GetByEventAsync(int eventId) =>
            _attendanceRepository.GetByEventAsync(eventId);

        public Task<IEnumerable<Attendance>> GetByMemberAsync(int memberId) =>
            _attendanceRepository.GetByMemberAsync(memberId);

        public Task<bool> ExistsAsync(int memberId, int eventId) =>
            _attendanceRepository.ExistsAsync(memberId, eventId);
    }
}

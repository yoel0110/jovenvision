using JovenVision.Application.Common;
using JovenVision.Application.DTOs.Attendance;
using JovenVision.Application.Services.Interfaces;
using JovenVision.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace JovenVision.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AttendanceController : ControllerBase
    {
        private readonly IAttendanceService _attendanceService;

        public AttendanceController(IAttendanceService attendanceService)
        {
            _attendanceService = attendanceService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var attendances = await _attendanceService.GetAllAsync();
            var result = attendances.Select(a => new AttendanceResponseDto
            {
                Id = a.Id,
                MemberId = a.MemberId,
                EventId = a.EventId,
                Status = a.Status,
                RegisteredAt = a.RegisteredAt
            });
            return Ok(ApiResponse<IEnumerable<AttendanceResponseDto>>.Ok(result));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var attendance = await _attendanceService.GetByIdAsync(id);
            if (attendance is null)
                return NotFound(ApiResponse<AttendanceResponseDto>.Fail("Asistencia no encontrada."));

            var result = new AttendanceResponseDto
            {
                Id = attendance.Id,
                MemberId = attendance.MemberId,
                EventId = attendance.EventId,
                Status = attendance.Status,
                RegisteredAt = attendance.RegisteredAt
            };
            return Ok(ApiResponse<AttendanceResponseDto>.Ok(result));
        }

        [HttpGet("event/{eventId}")]
        public async Task<IActionResult> GetByEvent(int eventId)
        {
            var attendances = await _attendanceService.GetByEventAsync(eventId);
            var result = attendances.Select(a => new AttendanceResponseDto
            {
                Id = a.Id,
                MemberId = a.MemberId,
                EventId = a.EventId,
                Status = a.Status,
                RegisteredAt = a.RegisteredAt
            });
            return Ok(ApiResponse<IEnumerable<AttendanceResponseDto>>.Ok(result));
        }

        [HttpGet("member/{memberId}")]
        public async Task<IActionResult> GetByMember(int memberId)
        {
            var attendances = await _attendanceService.GetByMemberAsync(memberId);
            var result = attendances.Select(a => new AttendanceResponseDto
            {
                Id = a.Id,
                MemberId = a.MemberId,
                EventId = a.EventId,
                Status = a.Status,
                RegisteredAt = a.RegisteredAt
            });
            return Ok(ApiResponse<IEnumerable<AttendanceResponseDto>>.Ok(result));
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromBody] AttendanceRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<AttendanceResponseDto>.Fail("Datos inválidos.",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)));

            try
            {
                var attendance = new Attendance
                {
                    MemberId = dto.MemberId,
                    EventId = dto.EventId,
                    Status = dto.Status
                };
                await _attendanceService.RegisterAsync(attendance);
                return CreatedAtAction(nameof(GetById), new { id = attendance.Id },
                    ApiResponse<AttendanceResponseDto>.Ok(new AttendanceResponseDto
                    {
                        Id = attendance.Id,
                        MemberId = attendance.MemberId,
                        EventId = attendance.EventId,
                        Status = attendance.Status,
                        RegisteredAt = attendance.RegisteredAt
                    }, "Asistencia registrada correctamente."));
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ApiResponse<AttendanceResponseDto>.Fail(ex.Message));
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] AttendanceRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<AttendanceResponseDto>.Fail("Datos inválidos.",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)));

            var existing = await _attendanceService.GetByIdAsync(id);
            if (existing is null)
                return NotFound(ApiResponse<AttendanceResponseDto>.Fail("Asistencia no encontrada."));

            existing.MemberId = dto.MemberId;
            existing.EventId = dto.EventId;
            existing.Status = dto.Status;

            await _attendanceService.UpdateAsync(existing);
            return Ok(ApiResponse<string>.Ok(null!, "Asistencia actualizada correctamente."));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _attendanceService.GetByIdAsync(id);
            if (existing is null)
                return NotFound(ApiResponse<string>.Fail("Asistencia no encontrada."));

            await _attendanceService.DeleteAsync(id);
            return Ok(ApiResponse<string>.Ok(null!, "Asistencia eliminada correctamente."));
        }
    }
}

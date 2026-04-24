using JovenVision.Application.Common;
using JovenVision.Application.DTOs.Attendance;
using JovenVision.Application.DTOs.Event;
using JovenVision.Application.Services.Interfaces;
using JovenVision.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JovenVision.Api.Controllers
{
    [ApiController]
    [Route("api/attendance")]
    [Authorize]
    public class AttendanceController : ControllerBase
    {
        private readonly IAttendanceService _attendanceService;

        public AttendanceController(IAttendanceService attendanceService)
        {
            _attendanceService = attendanceService;
        }

        private static AttendanceResponseDto ToDto(Attendance a) => new()
        {
            Id = a.Id, 
            MemberId = a.MemberId, 
            EventId = a.EventId,
            Status = a.Status, 
            RegisteredAt = a.RegisteredAt,
            Event = a.Event != null ? new EventResponseDto
            {
                Id = a.Event.Id,
                Title = a.Event.Title,
                Date = a.Event.Date,
                Type = a.Event.Type,
                Location = a.Event.Location,
                Capacity = a.Event.Capacity,
                Status = a.Event.Status,
                GroupId = a.Event.GroupId
            } : null
        };

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _attendanceService.GetAllAsync();
            return Ok(ApiResponse<IEnumerable<AttendanceResponseDto>>.Ok(list.Select(ToDto)));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var attendance = await _attendanceService.GetByIdAsync(id);
                return Ok(ApiResponse<AttendanceResponseDto>.Ok(ToDto(attendance)));
            }
            catch (NotFoundException ex)
            {
                return NotFound(ApiResponse<AttendanceResponseDto>.Fail(ex.Message));
            }
        }

        [HttpGet("event/{eventId}")]
        public async Task<IActionResult> GetByEvent(int eventId)
        {
            var list = await _attendanceService.GetByEventAsync(eventId);
            return Ok(ApiResponse<IEnumerable<AttendanceResponseDto>>.Ok(list.Select(ToDto)));
        }

        [HttpGet("member/{memberId}")]
        public async Task<IActionResult> GetByMember(int memberId)
        {
            var list = await _attendanceService.GetByMemberAsync(memberId);
            return Ok(ApiResponse<IEnumerable<AttendanceResponseDto>>.Ok(list.Select(ToDto)));
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromBody] AttendanceRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<AttendanceResponseDto>.Fail("Datos inválidos.",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)));

            try
            {
                var attendance = new Attendance { MemberId = dto.MemberId, EventId = dto.EventId, Status = dto.Status };
                await _attendanceService.RegisterAsync(attendance);
                return CreatedAtAction(nameof(GetById), new { id = attendance.Id },
                    ApiResponse<AttendanceResponseDto>.Ok(ToDto(attendance), "Asistencia registrada correctamente."));
            }
            catch (NotFoundException ex)
            {
                return NotFound(ApiResponse<AttendanceResponseDto>.Fail(ex.Message));
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

            try
            {
                var attendance = new Attendance { Id = id, MemberId = dto.MemberId, EventId = dto.EventId, Status = dto.Status };
                await _attendanceService.UpdateAsync(attendance);
                return Ok(ApiResponse<string>.Ok(null!, "Asistencia actualizada correctamente."));
            }
            catch (NotFoundException ex)
            {
                return NotFound(ApiResponse<string>.Fail(ex.Message));
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _attendanceService.DeleteAsync(id);
                return Ok(ApiResponse<string>.Ok(null!, "Asistencia eliminada correctamente."));
            }
            catch (NotFoundException ex)
            {
                return NotFound(ApiResponse<string>.Fail(ex.Message));
            }
        }
    }
}

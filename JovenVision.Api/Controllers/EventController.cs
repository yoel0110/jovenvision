using JovenVision.Application.Common;
using JovenVision.Application.DTOs.Event;
using JovenVision.Application.Services.Interfaces;
using JovenVision.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JovenVision.Api.Controllers
{
    [ApiController]
    [Route("api/events")]
    [Authorize]
    public class EventController : ControllerBase
    {
        private readonly IEventService _eventService;

        public EventController(IEventService eventService)
        {
            _eventService = eventService;
        }

        private static EventResponseDto ToDto(Event e) => new()
        {
            Id = e.Id,
            Title = e.Title,
            Type = e.Type,
            Date = e.Date,
            Location = e.Location,
            Capacity = e.Capacity,
            Status = e.Status,
            GroupId = e.GroupId,
            Group = e.Group != null ? new GroupSummaryDto { Id = e.Group.Id, Name = e.Group.Name } : null
        };

        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? title = null,
            [FromQuery] string? type = null,
            [FromQuery] string? status = null,
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            var result = await _eventService.GetPagedAsync(page, pageSize, title, type, status, startDate, endDate);
            return Ok(ApiResponse<EventPagedResponseDto>.Ok(result));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var ev = await _eventService.GetByIdAsync(id);
                return Ok(ApiResponse<EventResponseDto>.Ok(ToDto(ev)));
            }
            catch (NotFoundException ex)
            {
                return NotFound(ApiResponse<EventResponseDto>.Fail(ex.Message));
            }
        }

        [HttpGet("upcoming")]
        public async Task<IActionResult> GetUpcoming()
        {
            var events = await _eventService.GetUpcomingAsync();
            return Ok(ApiResponse<IEnumerable<EventResponseDto>>.Ok(events.Select(ToDto)));
        }

        [HttpGet("group/{groupId}")]
        public async Task<IActionResult> GetByGroup(int groupId)
        {
            var events = await _eventService.GetByGroupAsync(groupId);
            return Ok(ApiResponse<IEnumerable<EventResponseDto>>.Ok(events.Select(ToDto)));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] EventRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<EventResponseDto>.Fail("Datos inválidos.",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)));

            try
            {
                var ev = new Event { Title = dto.Title, Type = dto.Type, Date = dto.Date, Location = dto.Location ?? string.Empty, Capacity = dto.Capacity, GroupId = dto.GroupId, Status = dto.Status };
                await _eventService.AddAsync(ev);
                return CreatedAtAction(nameof(GetById), new { id = ev.Id },
                    ApiResponse<EventResponseDto>.Ok(ToDto(ev), "Evento creado correctamente."));
            }
            catch (NotFoundException ex)
            {
                return NotFound(ApiResponse<EventResponseDto>.Fail(ex.Message));
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] EventRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<EventResponseDto>.Fail("Datos inválidos.",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)));

            try
            {
                var ev = new Event { Id = id, Title = dto.Title, Type = dto.Type, Date = dto.Date, Location = dto.Location ?? string.Empty, Capacity = dto.Capacity, GroupId = dto.GroupId, Status = dto.Status };
                await _eventService.UpdateAsync(ev);
                return Ok(ApiResponse<string>.Ok(null!, "Evento actualizado correctamente."));
            }
            catch (NotFoundException ex)
            {
                return NotFound(ApiResponse<EventResponseDto>.Fail(ex.Message));
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _eventService.DeleteAsync(id);
                return Ok(ApiResponse<string>.Ok(null!, "Evento eliminado correctamente."));
            }
            catch (NotFoundException ex)
            {
                return NotFound(ApiResponse<string>.Fail(ex.Message));
            }
        }
    }
}

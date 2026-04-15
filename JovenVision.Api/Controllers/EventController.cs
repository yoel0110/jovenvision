using JovenVision.Application.Common;
using JovenVision.Application.DTOs.Event;
using JovenVision.Application.Services.Interfaces;
using JovenVision.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace JovenVision.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventController : ControllerBase
    {
        private readonly IEventService _eventService;

        public EventController(IEventService eventService)
        {
            _eventService = eventService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var events = await _eventService.GetAllAsync();
            var result = events.Select(e => new EventResponseDto
            {
                Id = e.Id,
                Title = e.Title,
                Type = e.Type,
                Date = e.Date,
                Location = e.Location,
                Capacity = e.Capacity,
                GroupId = e.GroupId
            });
            return Ok(ApiResponse<IEnumerable<EventResponseDto>>.Ok(result));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var ev = await _eventService.GetByIdAsync(id);
            if (ev is null)
                return NotFound(ApiResponse<EventResponseDto>.Fail("Evento no encontrado."));

            var result = new EventResponseDto
            {
                Id = ev.Id,
                Title = ev.Title,
                Type = ev.Type,
                Date = ev.Date,
                Location = ev.Location,
                Capacity = ev.Capacity,
                GroupId = ev.GroupId
            };
            return Ok(ApiResponse<EventResponseDto>.Ok(result));
        }

        [HttpGet("upcoming")]
        public async Task<IActionResult> GetUpcoming()
        {
            var events = await _eventService.GetUpcomingAsync();
            var result = events.Select(e => new EventResponseDto
            {
                Id = e.Id,
                Title = e.Title,
                Type = e.Type,
                Date = e.Date,
                Location = e.Location,
                Capacity = e.Capacity,
                GroupId = e.GroupId
            });
            return Ok(ApiResponse<IEnumerable<EventResponseDto>>.Ok(result));
        }

        [HttpGet("group/{groupId}")]
        public async Task<IActionResult> GetByGroup(int groupId)
        {
            var events = await _eventService.GetByGroupAsync(groupId);
            var result = events.Select(e => new EventResponseDto
            {
                Id = e.Id,
                Title = e.Title,
                Type = e.Type,
                Date = e.Date,
                Location = e.Location,
                Capacity = e.Capacity,
                GroupId = e.GroupId
            });
            return Ok(ApiResponse<IEnumerable<EventResponseDto>>.Ok(result));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] EventRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<EventResponseDto>.Fail("Datos inválidos.",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)));

            var ev = new Event
            {
                Title = dto.Title,
                Type = dto.Type,
                Date = dto.Date,
                Location = dto.Location ?? string.Empty,
                Capacity = dto.Capacity,
                GroupId = dto.GroupId
            };
            await _eventService.AddAsync(ev);
            return CreatedAtAction(nameof(GetById), new { id = ev.Id },
                ApiResponse<EventResponseDto>.Ok(new EventResponseDto
                {
                    Id = ev.Id,
                    Title = ev.Title,
                    Type = ev.Type,
                    Date = ev.Date,
                    Location = ev.Location,
                    Capacity = ev.Capacity,
                    GroupId = ev.GroupId
                }, "Evento creado correctamente."));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] EventRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<EventResponseDto>.Fail("Datos inválidos.",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)));

            var existing = await _eventService.GetByIdAsync(id);
            if (existing is null)
                return NotFound(ApiResponse<EventResponseDto>.Fail("Evento no encontrado."));

            existing.Title = dto.Title;
            existing.Type = dto.Type;
            existing.Date = dto.Date;
            existing.Location = dto.Location ?? string.Empty;
            existing.Capacity = dto.Capacity;
            existing.GroupId = dto.GroupId;

            await _eventService.UpdateAsync(existing);
            return Ok(ApiResponse<string>.Ok(null!, "Evento actualizado correctamente."));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _eventService.GetByIdAsync(id);
            if (existing is null)
                return NotFound(ApiResponse<string>.Fail("Evento no encontrado."));

            await _eventService.DeleteAsync(id);
            return Ok(ApiResponse<string>.Ok(null!, "Evento eliminado correctamente."));
        }
    }
}

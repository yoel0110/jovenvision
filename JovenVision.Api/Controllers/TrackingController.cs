using JovenVision.Application.Common;
using JovenVision.Application.DTOs.Tracking;
using JovenVision.Application.Services.Interfaces;
using JovenVision.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace JovenVision.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TrackingController : ControllerBase
    {
        private readonly ITrackingService _trackingService;

        public TrackingController(ITrackingService trackingService)
        {
            _trackingService = trackingService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var trackings = await _trackingService.GetAllAsync();
            var result = trackings.Select(t => new TrackingResponseDto
            {
                Id = t.Id,
                Description = t.Description,
                Date = t.Date,
                Type = t.Type,
                MemberId = t.MemberId
            });
            return Ok(ApiResponse<IEnumerable<TrackingResponseDto>>.Ok(result));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var tracking = await _trackingService.GetByIdAsync(id);
            if (tracking is null)
                return NotFound(ApiResponse<TrackingResponseDto>.Fail("Seguimiento no encontrado."));

            var result = new TrackingResponseDto
            {
                Id = tracking.Id,
                Description = tracking.Description,
                Date = tracking.Date,
                Type = tracking.Type,
                MemberId = tracking.MemberId
            };
            return Ok(ApiResponse<TrackingResponseDto>.Ok(result));
        }

        [HttpGet("member/{memberId}")]
        public async Task<IActionResult> GetByMember(int memberId)
        {
            var trackings = await _trackingService.GetByMemberAsync(memberId);
            var result = trackings.Select(t => new TrackingResponseDto
            {
                Id = t.Id,
                Description = t.Description,
                Date = t.Date,
                Type = t.Type,
                MemberId = t.MemberId
            });
            return Ok(ApiResponse<IEnumerable<TrackingResponseDto>>.Ok(result));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TrackingRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<TrackingResponseDto>.Fail("Datos inválidos.",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)));

            var tracking = new Tracking
            {
                Description = dto.Description,
                Date = dto.Date,
                Type = dto.Type,
                MemberId = dto.MemberId
            };
            await _trackingService.AddAsync(tracking);
            return CreatedAtAction(nameof(GetById), new { id = tracking.Id },
                ApiResponse<TrackingResponseDto>.Ok(new TrackingResponseDto
                {
                    Id = tracking.Id,
                    Description = tracking.Description,
                    Date = tracking.Date,
                    Type = tracking.Type,
                    MemberId = tracking.MemberId
                }, "Seguimiento creado correctamente."));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] TrackingRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<TrackingResponseDto>.Fail("Datos inválidos.",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)));

            var existing = await _trackingService.GetByIdAsync(id);
            if (existing is null)
                return NotFound(ApiResponse<TrackingResponseDto>.Fail("Seguimiento no encontrado."));

            existing.Description = dto.Description;
            existing.Date = dto.Date;
            existing.Type = dto.Type;
            existing.MemberId = dto.MemberId;

            await _trackingService.UpdateAsync(existing);
            return Ok(ApiResponse<string>.Ok(null!, "Seguimiento actualizado correctamente."));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _trackingService.GetByIdAsync(id);
            if (existing is null)
                return NotFound(ApiResponse<string>.Fail("Seguimiento no encontrado."));

            await _trackingService.DeleteAsync(id);
            return Ok(ApiResponse<string>.Ok(null!, "Seguimiento eliminado correctamente."));
        }
    }
}

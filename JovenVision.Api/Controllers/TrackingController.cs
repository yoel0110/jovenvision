using JovenVision.Application.Common;
using JovenVision.Application.DTOs.Tracking;
using JovenVision.Application.Services.Interfaces;
using JovenVision.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JovenVision.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TrackingController : ControllerBase
    {
        private readonly ITrackingService _trackingService;

        public TrackingController(ITrackingService trackingService)
        {
            _trackingService = trackingService;
        }

        private static TrackingResponseDto ToDto(Tracking t) => new()
        {
            Id = t.Id, Description = t.Description, Date = t.Date, Type = t.Type, MemberId = t.MemberId
        };

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _trackingService.GetAllAsync();
            return Ok(ApiResponse<IEnumerable<TrackingResponseDto>>.Ok(list.Select(ToDto)));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var tracking = await _trackingService.GetByIdAsync(id);
                return Ok(ApiResponse<TrackingResponseDto>.Ok(ToDto(tracking)));
            }
            catch (NotFoundException ex)
            {
                return NotFound(ApiResponse<TrackingResponseDto>.Fail(ex.Message));
            }
        }

        [HttpGet("member/{memberId}")]
        public async Task<IActionResult> GetByMember(int memberId)
        {
            var list = await _trackingService.GetByMemberAsync(memberId);
            return Ok(ApiResponse<IEnumerable<TrackingResponseDto>>.Ok(list.Select(ToDto)));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TrackingRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<TrackingResponseDto>.Fail("Datos inválidos.",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)));

            try
            {
                var tracking = new Tracking { Description = dto.Description, Date = dto.Date, Type = dto.Type, MemberId = dto.MemberId };
                await _trackingService.AddAsync(tracking);
                return CreatedAtAction(nameof(GetById), new { id = tracking.Id },
                    ApiResponse<TrackingResponseDto>.Ok(ToDto(tracking), "Seguimiento creado correctamente."));
            }
            catch (NotFoundException ex)
            {
                return NotFound(ApiResponse<TrackingResponseDto>.Fail(ex.Message));
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] TrackingRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<TrackingResponseDto>.Fail("Datos inválidos.",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)));

            try
            {
                var tracking = new Tracking { Id = id, Description = dto.Description, Date = dto.Date, Type = dto.Type, MemberId = dto.MemberId };
                await _trackingService.UpdateAsync(tracking);
                return Ok(ApiResponse<string>.Ok(null!, "Seguimiento actualizado correctamente."));
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
                await _trackingService.DeleteAsync(id);
                return Ok(ApiResponse<string>.Ok(null!, "Seguimiento eliminado correctamente."));
            }
            catch (NotFoundException ex)
            {
                return NotFound(ApiResponse<string>.Fail(ex.Message));
            }
        }
    }
}

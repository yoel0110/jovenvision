using JovenVision.Application.Common;
using JovenVision.Application.DTOs.Member;
using JovenVision.Application.Services.Interfaces;
using JovenVision.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace JovenVision.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MemberController : ControllerBase
    {
        private readonly IMemberService _memberService;

        public MemberController(IMemberService memberService)
        {
            _memberService = memberService;
        }

        private static MemberResponseDto ToDto(Member m) => new()
        {
            Id = m.Id, Name = m.Name, Email = m.Email, Phone = m.Phone, Status = m.Status
        };

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var members = await _memberService.GetAllAsync();
            return Ok(ApiResponse<IEnumerable<MemberResponseDto>>.Ok(members.Select(ToDto)));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var member = await _memberService.GetByIdAsync(id);
                return Ok(ApiResponse<MemberResponseDto>.Ok(ToDto(member)));
            }
            catch (NotFoundException ex)
            {
                return NotFound(ApiResponse<MemberResponseDto>.Fail(ex.Message));
            }
        }

        [HttpGet("status/{status}")]
        public async Task<IActionResult> GetByStatus(string status)
        {
            var members = await _memberService.GetByStatusAsync(status);
            return Ok(ApiResponse<IEnumerable<MemberResponseDto>>.Ok(members.Select(ToDto)));
        }

        [HttpGet("{id}/history")]
        public async Task<IActionResult> GetHistory(int id)
        {
            var history = await _memberService.GetHistoryAsync(id);
            return Ok(ApiResponse<IEnumerable<Attendance>>.Ok(history));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] MemberRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<MemberResponseDto>.Fail("Datos inválidos.",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)));

            var member = new Member { Name = dto.Name, Email = dto.Email, Phone = dto.Phone ?? string.Empty, Status = dto.Status };
            await _memberService.AddAsync(member);
            return CreatedAtAction(nameof(GetById), new { id = member.Id },
                ApiResponse<MemberResponseDto>.Ok(ToDto(member), "Miembro creado correctamente."));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] MemberRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<MemberResponseDto>.Fail("Datos inválidos.",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)));

            try
            {
                var member = new Member { Id = id, Name = dto.Name, Email = dto.Email, Phone = dto.Phone ?? string.Empty, Status = dto.Status };
                await _memberService.UpdateAsync(member);
                return Ok(ApiResponse<string>.Ok(null!, "Miembro actualizado correctamente."));
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
                await _memberService.DeleteAsync(id);
                return Ok(ApiResponse<string>.Ok(null!, "Miembro eliminado correctamente."));
            }
            catch (NotFoundException ex)
            {
                return NotFound(ApiResponse<string>.Fail(ex.Message));
            }
        }
    }
}

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

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var members = await _memberService.GetAllAsync();
            var result = members.Select(m => new MemberResponseDto
            {
                Id = m.Id,
                Name = m.Name,
                Email = m.Email,
                Phone = m.Phone,
                Status = m.Status
            });
            return Ok(ApiResponse<IEnumerable<MemberResponseDto>>.Ok(result));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var member = await _memberService.GetByIdAsync(id);
            if (member is null)
                return NotFound(ApiResponse<MemberResponseDto>.Fail("Miembro no encontrado."));

            var result = new MemberResponseDto
            {
                Id = member.Id,
                Name = member.Name,
                Email = member.Email,
                Phone = member.Phone,
                Status = member.Status
            };
            return Ok(ApiResponse<MemberResponseDto>.Ok(result));
        }

        [HttpGet("status/{status}")]
        public async Task<IActionResult> GetByStatus(string status)
        {
            var members = await _memberService.GetByStatusAsync(status);
            var result = members.Select(m => new MemberResponseDto
            {
                Id = m.Id,
                Name = m.Name,
                Email = m.Email,
                Phone = m.Phone,
                Status = m.Status
            });
            return Ok(ApiResponse<IEnumerable<MemberResponseDto>>.Ok(result));
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

            var member = new Member
            {
                Name = dto.Name,
                Email = dto.Email,
                Phone = dto.Phone ?? string.Empty,
                Status = dto.Status
            };
            await _memberService.AddAsync(member);
            return CreatedAtAction(nameof(GetById), new { id = member.Id },
                ApiResponse<MemberResponseDto>.Ok(new MemberResponseDto
                {
                    Id = member.Id,
                    Name = member.Name,
                    Email = member.Email,
                    Phone = member.Phone,
                    Status = member.Status
                }, "Miembro creado correctamente."));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] MemberRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<MemberResponseDto>.Fail("Datos inválidos.",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)));

            var existing = await _memberService.GetByIdAsync(id);
            if (existing is null)
                return NotFound(ApiResponse<MemberResponseDto>.Fail("Miembro no encontrado."));

            existing.Name = dto.Name;
            existing.Email = dto.Email;
            existing.Phone = dto.Phone ?? string.Empty;
            existing.Status = dto.Status;

            await _memberService.UpdateAsync(existing);
            return Ok(ApiResponse<string>.Ok(null!, "Miembro actualizado correctamente."));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _memberService.GetByIdAsync(id);
            if (existing is null)
                return NotFound(ApiResponse<string>.Fail("Miembro no encontrado."));

            await _memberService.DeleteAsync(id);
            return Ok(ApiResponse<string>.Ok(null!, "Miembro eliminado correctamente."));
        }
    }
}

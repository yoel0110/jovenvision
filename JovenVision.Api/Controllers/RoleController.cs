using JovenVision.Application.Common;
using JovenVision.Application.DTOs.Role;
using JovenVision.Application.Services.Interfaces;
using JovenVision.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace JovenVision.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;

        public RoleController(IRoleService roleService)
        {
            _roleService = roleService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var roles = await _roleService.GetAllAsync();
            var result = roles.Select(r => new RoleResponseDto
            {
                Id = r.Id,
                Name = r.Name
            });
            return Ok(ApiResponse<IEnumerable<RoleResponseDto>>.Ok(result));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var role = await _roleService.GetByIdAsync(id);
            if (role is null)
                return NotFound(ApiResponse<RoleResponseDto>.Fail("Rol no encontrado."));

            var result = new RoleResponseDto { Id = role.Id, Name = role.Name };
            return Ok(ApiResponse<RoleResponseDto>.Ok(result));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] RoleRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<RoleResponseDto>.Fail("Datos inválidos.",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)));

            var role = new Role { Name = dto.Name };
            await _roleService.AddAsync(role);
            return CreatedAtAction(nameof(GetById), new { id = role.Id },
                ApiResponse<RoleResponseDto>.Ok(new RoleResponseDto { Id = role.Id, Name = role.Name },
                    "Rol creado correctamente."));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] RoleRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<RoleResponseDto>.Fail("Datos inválidos.",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)));

            var existing = await _roleService.GetByIdAsync(id);
            if (existing is null)
                return NotFound(ApiResponse<RoleResponseDto>.Fail("Rol no encontrado."));

            existing.Name = dto.Name;
            await _roleService.UpdateAsync(existing);
            return Ok(ApiResponse<string>.Ok(null!, "Rol actualizado correctamente."));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _roleService.GetByIdAsync(id);
            if (existing is null)
                return NotFound(ApiResponse<string>.Fail("Rol no encontrado."));

            await _roleService.DeleteAsync(id);
            return Ok(ApiResponse<string>.Ok(null!, "Rol eliminado correctamente."));
        }
    }
}

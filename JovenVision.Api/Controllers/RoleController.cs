using JovenVision.Application.Common;
using JovenVision.Application.DTOs.Role;
using JovenVision.Application.Services.Interfaces;
using JovenVision.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JovenVision.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
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
            return Ok(ApiResponse<IEnumerable<RoleResponseDto>>.Ok(roles.Select(r => new RoleResponseDto { Id = r.Id, Name = r.Name })));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var role = await _roleService.GetByIdAsync(id);
                return Ok(ApiResponse<RoleResponseDto>.Ok(new RoleResponseDto { Id = role.Id, Name = role.Name }));
            }
            catch (NotFoundException ex)
            {
                return NotFound(ApiResponse<RoleResponseDto>.Fail(ex.Message));
            }
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
                ApiResponse<RoleResponseDto>.Ok(new RoleResponseDto { Id = role.Id, Name = role.Name }, "Rol creado correctamente."));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] RoleRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<RoleResponseDto>.Fail("Datos inválidos.",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)));

            try
            {
                var role = new Role { Id = id, Name = dto.Name };
                await _roleService.UpdateAsync(role);
                return Ok(ApiResponse<string>.Ok(null!, "Rol actualizado correctamente."));
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
                await _roleService.DeleteAsync(id);
                return Ok(ApiResponse<string>.Ok(null!, "Rol eliminado correctamente."));
            }
            catch (NotFoundException ex)
            {
                return NotFound(ApiResponse<string>.Fail(ex.Message));
            }
        }
    }
}

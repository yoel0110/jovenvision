using JovenVision.Application.Common;
using JovenVision.Application.DTOs.User;
using JovenVision.Application.Services.Interfaces;
using JovenVision.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace JovenVision.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetAllAsync();
            var result = users.Select(u => new UserResponseDto
            {
                Id = u.Id,
                Username = u.Username,
                Active = u.Active,
                RoleId = u.RoleId,
                MemberId = u.MemberId
            });
            return Ok(ApiResponse<IEnumerable<UserResponseDto>>.Ok(result));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user is null)
                return NotFound(ApiResponse<UserResponseDto>.Fail("Usuario no encontrado."));

            var result = new UserResponseDto
            {
                Id = user.Id,
                Username = user.Username,
                Active = user.Active,
                RoleId = user.RoleId,
                MemberId = user.MemberId
            };
            return Ok(ApiResponse<UserResponseDto>.Ok(result));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] UserRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<UserResponseDto>.Fail("Datos inválidos.",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)));

            bool exists = await _userService.ExistsAsync(dto.Username);
            if (exists)
                return Conflict(ApiResponse<UserResponseDto>.Fail("El nombre de usuario ya está en uso."));

            var user = new User
            {
                Username = dto.Username,
                PasswordHash = BCrypt(dto.Password),
                Active = true,
                RoleId = dto.RoleId,
                MemberId = dto.MemberId
            };
            await _userService.AddAsync(user);
            return CreatedAtAction(nameof(GetById), new { id = user.Id },
                ApiResponse<UserResponseDto>.Ok(new UserResponseDto
                {
                    Id = user.Id,
                    Username = user.Username,
                    Active = user.Active,
                    RoleId = user.RoleId,
                    MemberId = user.MemberId
                }, "Usuario creado correctamente."));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UserRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<UserResponseDto>.Fail("Datos inválidos.",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)));

            var existing = await _userService.GetByIdAsync(id);
            if (existing is null)
                return NotFound(ApiResponse<UserResponseDto>.Fail("Usuario no encontrado."));

            existing.Username = dto.Username;
            existing.PasswordHash = BCrypt(dto.Password);
            existing.RoleId = dto.RoleId;
            existing.MemberId = dto.MemberId;

            await _userService.UpdateAsync(existing);
            return Ok(ApiResponse<string>.Ok(null!, "Usuario actualizado correctamente."));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _userService.GetByIdAsync(id);
            if (existing is null)
                return NotFound(ApiResponse<string>.Fail("Usuario no encontrado."));

            await _userService.DeleteAsync(id);
            return Ok(ApiResponse<string>.Ok(null!, "Usuario eliminado correctamente."));
        }

        // Simple hash placeholder — replace with a proper BCrypt package when auth is implemented.
        private static string BCrypt(string password) =>
            Convert.ToBase64String(System.Security.Cryptography.SHA256.HashData(
                System.Text.Encoding.UTF8.GetBytes(password)));
    }
}

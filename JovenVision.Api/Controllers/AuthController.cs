using JovenVision.Api.Services;
using JovenVision.Application.Common;
using JovenVision.Application.DTOs.Auth;
using JovenVision.Application.Services.Interfaces;
using JovenVision.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace JovenVision.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IRoleService _roleService;
        private readonly IJwtService _jwtService;

        public AuthController(IUserService userService, IRoleService roleService, IJwtService jwtService)
        {
            _userService = userService;
            _roleService = roleService;
            _jwtService = jwtService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<LoginResponseDto>.Fail("Datos inválidos.",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)));

            var user = await _userService.GetByEmailAsync(dto.Email);
            if (user is null)
                return Unauthorized(ApiResponse<LoginResponseDto>.Fail("Credenciales incorrectas."));

            if (!user.Active)
                return Unauthorized(ApiResponse<LoginResponseDto>.Fail("Usuario inactivo."));

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized(ApiResponse<LoginResponseDto>.Fail("Credenciales incorrectas."));

            Role? role;
            try { role = await _roleService.GetByIdAsync(user.RoleId); }
            catch (NotFoundException) { role = null; }

            var roleName = role?.Name ?? "Leader";
            var expiresAt = DateTime.UtcNow.AddMinutes(60);
            var token = _jwtService.GenerateToken(user, roleName);

            return Ok(ApiResponse<LoginResponseDto>.Ok(new LoginResponseDto
            {
                Id = user.Id,
                Token = token,
                Username = user.Username,
                Role = roleName,
                ExpiresAt = expiresAt
            }, "Login exitoso."));
        }
    }
}

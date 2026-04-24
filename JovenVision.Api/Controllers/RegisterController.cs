using JovenVision.Application.Common;
using JovenVision.Application.DTOs.User;
using JovenVision.Application.Services.Interfaces;
using JovenVision.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace JovenVision.Api.Controllers
{
    //[ApiController]
    //[Route("api/[controller]")]
    public class RegisterController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IRoleService _roleService;

        public RegisterController(IUserService userService, IRoleService roleService)
        {
            _userService = userService;
            _roleService = roleService;
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromBody] UserRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<UserResponseDto>.Fail("Datos inválidos.",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)));

            bool exists = await _userService.ExistsAsync(dto.Username);
            if (exists)
                return Conflict(ApiResponse<UserResponseDto>.Fail("El nombre de usuario ya está en uso."));

            // Si no se especifica rol, usar rol por defecto (Leader)
            var roleId = dto.RoleId;
            if (roleId == 0)
            {
                try
                {
                    var leaderRole = await _roleService.GetByNameAsync("Leader");
                    roleId = leaderRole.Id;
                }
                catch
                {
                    // Si no existe el rol Leader, usar el primer rol disponible
                    var roles = await _roleService.GetAllAsync();
                    if (!roles.Any())
                        return BadRequest(ApiResponse<UserResponseDto>.Fail("No hay roles configurados en el sistema."));
                    roleId = roles.First().Id;
                }
            }

            var user = new User
            {
                Username = dto.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Active = true,
                RoleId = roleId,
                MemberId = dto.MemberId
            };
            
            await _userService.AddAsync(user);
            
            var responseDto = new UserResponseDto
            {
                Id = user.Id,
                Username = user.Username,
                Active = user.Active,
                RoleId = user.RoleId,
                MemberId = user.MemberId
            };
            
            return CreatedAtAction(nameof(Register), new { id = user.Id },
                ApiResponse<UserResponseDto>.Ok(responseDto, "Usuario creado correctamente."));
        }
    }

    public class UserResponseDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public bool Active { get; set; }
        public int RoleId { get; set; }
        public int? MemberId { get; set; }
    }
}

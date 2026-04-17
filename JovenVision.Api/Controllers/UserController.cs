using JovenVision.Application.Common;
using JovenVision.Application.DTOs.User;
using JovenVision.Application.Services.Interfaces;
using JovenVision.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JovenVision.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        private static UserResponseDto ToDto(User u) => new()
        {
            Id = u.Id, Username = u.Username, Active = u.Active, RoleId = u.RoleId, MemberId = u.MemberId
        };

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetAllAsync();
            return Ok(ApiResponse<IEnumerable<UserResponseDto>>.Ok(users.Select(ToDto)));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var user = await _userService.GetByIdAsync(id);
                return Ok(ApiResponse<UserResponseDto>.Ok(ToDto(user)));
            }
            catch (NotFoundException ex)
            {
                return NotFound(ApiResponse<UserResponseDto>.Fail(ex.Message));
            }
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
                PasswordHash = HashPassword(dto.Password),
                Active = true,
                RoleId = dto.RoleId,
                MemberId = dto.MemberId
            };
            await _userService.AddAsync(user);
            return CreatedAtAction(nameof(GetById), new { id = user.Id },
                ApiResponse<UserResponseDto>.Ok(ToDto(user), "Usuario creado correctamente."));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UserRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<UserResponseDto>.Fail("Datos inválidos.",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)));

            try
            {
                var user = new User { Id = id, Username = dto.Username, PasswordHash = HashPassword(dto.Password), RoleId = dto.RoleId, MemberId = dto.MemberId };
                await _userService.UpdateAsync(user);
                return Ok(ApiResponse<string>.Ok(null!, "Usuario actualizado correctamente."));
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
                await _userService.DeleteAsync(id);
                return Ok(ApiResponse<string>.Ok(null!, "Usuario eliminado correctamente."));
            }
            catch (NotFoundException ex)
            {
                return NotFound(ApiResponse<string>.Fail(ex.Message));
            }
        }

        private static string HashPassword(string password) =>
            Convert.ToBase64String(System.Security.Cryptography.SHA256.HashData(
                System.Text.Encoding.UTF8.GetBytes(password)));
    }
}

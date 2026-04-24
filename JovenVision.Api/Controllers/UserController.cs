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

        private static UserDetailsResponseDto ToDto(User u) => new()
        {
            Id = u.Id,
            Username = u.Username,
            Active = u.Active,
            RoleId = u.RoleId,
            MemberId = u.MemberId,
            MemberName = u.Member?.Name
        };

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetAllAsync();
            return Ok(ApiResponse<IEnumerable<UserDetailsResponseDto>>.Ok(users.Select(ToDto)));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var user = await _userService.GetByIdAsync(id);
                return Ok(ApiResponse<UserDetailsResponseDto>.Ok(ToDto(user)));
            }
            catch (NotFoundException ex)
            {
                return NotFound(ApiResponse<UserDetailsResponseDto>.Fail(ex.Message));
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] UserRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<UserDetailsResponseDto>.Fail("Datos inválidos.",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)));

            bool exists = await _userService.ExistsAsync(dto.Username);
            if (exists)
                return Conflict(ApiResponse<UserDetailsResponseDto>.Fail("El nombre de usuario ya está en uso."));

            try
            {
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
                    ApiResponse<UserDetailsResponseDto>.Ok(ToDto(user), "Usuario creado correctamente."));
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ApiResponse<UserDetailsResponseDto>.Fail(ex.Message));
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UserRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<string>.Fail("Datos inválidos.",
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
            catch (InvalidOperationException ex)
            {
                return Conflict(ApiResponse<string>.Fail(ex.Message));
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
            BCrypt.Net.BCrypt.HashPassword(password);
    }
}

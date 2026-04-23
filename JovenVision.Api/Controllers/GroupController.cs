using JovenVision.Application.Common;
using JovenVision.Application.DTOs.Group;
using JovenVision.Application.DTOs.Member;
using JovenVision.Application.Services.Interfaces;
using JovenVision.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JovenVision.Api.Controllers
{
    [ApiController]
    [Route("api/groups")]
    [Authorize]
    public class GroupController : ControllerBase
    {
        private readonly IGroupService _groupService;

        public GroupController(IGroupService groupService)
        {
            _groupService = groupService;
        }

        private static GroupResponseDto ToDto(Group g) => new()
        {
            Id = g.Id, 
            Name = g.Name, 
            Description = g.Description, 
            Capacity = g.Capacity, 
            Status = string.IsNullOrEmpty(g.Status) ? "ACTIVE" : g.Status, 
            CreatedAt = g.CreatedAt == default ? DateTime.Now : g.CreatedAt
        };

        private async Task<bool> IsAuthorizedForGroup(int groupId)
        {
            if (User.IsInRole("Admin")) return true;
            var memberIdClaim = User.FindFirst("memberId")?.Value;
            if (string.IsNullOrEmpty(memberIdClaim) || !int.TryParse(memberIdClaim, out int memberId))
                return false;
            var members = await _groupService.GetMembersAsync(groupId);
            return members.Any(gm => gm.MemberId == memberId);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var groups = await _groupService.GetAllAsync();

            if (User.IsInRole("Admin"))
                return Ok(ApiResponse<IEnumerable<GroupResponseDto>>.Ok(groups.Select(ToDto)));

            var memberIdClaim = User.FindFirst("memberId")?.Value;
            if (string.IsNullOrEmpty(memberIdClaim) || !int.TryParse(memberIdClaim, out int memberId))
                return Forbid();

            var leaderGroups = groups.Where(g => g.GroupMembers.Any(gm => gm.MemberId == memberId));
            return Ok(ApiResponse<IEnumerable<GroupResponseDto>>.Ok(leaderGroups.Select(ToDto)));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                if (!await IsAuthorizedForGroup(id))
                    return Forbid();

                var group = await _groupService.GetByIdAsync(id);
                return Ok(ApiResponse<GroupResponseDto>.Ok(ToDto(group)));
            }
            catch (NotFoundException ex)
            {
                return NotFound(ApiResponse<GroupResponseDto>.Fail(ex.Message));
            }
        }

        [HttpGet("{id}/members")]
        public async Task<IActionResult> GetMembers(int id)
        {
            if (!await IsAuthorizedForGroup(id))
                return Forbid();

            var groupMembers = await _groupService.GetMembersAsync(id);
            var result = groupMembers.Select(gm => new MemberResponseDto { Id = gm.Member.Id, Name = gm.Member.Name, Email = gm.Member.Email, Phone = gm.Member.Phone, Status = gm.Member.Status, Role = gm.Role });
            return Ok(ApiResponse<IEnumerable<MemberResponseDto>>.Ok(result));
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] GroupRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<GroupResponseDto>.Fail("Datos inválidos.",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)));

            var group = new Group { Name = dto.Name, Description = dto.Description ?? string.Empty, Capacity = dto.Capacity };
            await _groupService.AddAsync(group);
            return CreatedAtAction(nameof(GetById), new { id = group.Id },
                ApiResponse<GroupResponseDto>.Ok(ToDto(group), "Grupo creado correctamente."));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] GroupRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<GroupResponseDto>.Fail("Datos inválidos.",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)));

            try
            {
                var group = new Group { Id = id, Name = dto.Name, Description = dto.Description ?? string.Empty, Capacity = dto.Capacity };
                await _groupService.UpdateAsync(group);
                return Ok(ApiResponse<string>.Ok(null!, "Grupo actualizado correctamente."));
            }
            catch (NotFoundException ex)
            {
                return NotFound(ApiResponse<string>.Fail(ex.Message));
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _groupService.DeleteAsync(id);
                return Ok(ApiResponse<string>.Ok(null!, "Grupo eliminado correctamente."));
            }
            catch (NotFoundException ex)
            {
                return NotFound(ApiResponse<string>.Fail(ex.Message));
            }
        }

        [HttpPost("{groupId}/members/{memberId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddMember(int groupId, int memberId, [FromQuery] string role = "Seguidor")
        {
            await _groupService.AddMemberAsync(groupId, memberId, role);
            return Ok(ApiResponse<string>.Ok(null!, "Miembro agregado al grupo correctamente."));
        }

        [HttpDelete("{groupId}/members/{memberId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RemoveMember(int groupId, int memberId)
        {
            await _groupService.RemoveMemberAsync(groupId, memberId);
            return Ok(ApiResponse<string>.Ok(null!, "Miembro removido del grupo correctamente."));
        }
    }
}

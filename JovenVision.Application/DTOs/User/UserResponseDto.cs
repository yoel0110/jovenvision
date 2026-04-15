namespace JovenVision.Application.DTOs.User
{
    public class UserResponseDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public bool Active { get; set; }
        public int RoleId { get; set; }
        public int? MemberId { get; set; }
    }
}

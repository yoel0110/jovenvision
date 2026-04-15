namespace JovenVision.Application.DTOs.Group
{
    public class GroupResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int Capacity { get; set; }
    }
}

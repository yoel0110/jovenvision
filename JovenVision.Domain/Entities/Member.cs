namespace JovenVision.Domain.Entities
{
    public class Member : EntityBase
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Status { get; set; }
        public ICollection<GroupMember> GroupMembers { get; set; } = new List<GroupMember>();
    }
}

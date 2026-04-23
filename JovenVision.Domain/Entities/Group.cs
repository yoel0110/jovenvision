namespace JovenVision.Domain.Entities
{
    public class Group : EntityBase
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int Capacity { get; set; }
        public string Status { get; set; } = "ACTIVE";
        public ICollection<GroupMember> GroupMembers { get; set; } = new List<GroupMember>();
    }
}

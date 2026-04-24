namespace JovenVision.Domain.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public bool Active { get; set; }
        public int RoleId { get; set; }
        public int? MemberId { get; set; }
        public virtual Member? Member { get; set; }
    }
}

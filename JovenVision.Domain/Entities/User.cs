using System;
using System.Collections.Generic;
using System.Text;

namespace JovenVision.Domain.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public bool Active { get; set; }
        public int RoleId { get; set; }
        public Role Role { get; set; }
        public int? MemberId { get; set; }
        public Member Member { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Text;

namespace JovenVision.Domain.Entities
{
    public class Group : EntityBase
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int Capacity { get; set; }
        public ICollection<Member> Members { get; set; }
        public ICollection<Event> Events { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;

namespace JovenVision.Domain.Entities
{
    public class Member : EntityBase
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Status { get; set; } // Active / Inactive / New
        public ICollection<Attendance> Attendances { get; set; }
        public ICollection<Tracking> Trackings { get; set; }
        public ICollection<Group> Groups { get; set; }
    }
}

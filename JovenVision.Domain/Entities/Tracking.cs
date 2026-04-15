using System;
using System.Collections.Generic;
using System.Text;

namespace JovenVision.Domain.Entities
{
    public class Tracking
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public string Type { get; set; }  
        public int MemberId { get; set; }
        public Member Member { get; set; }
    }
}

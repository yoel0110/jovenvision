using System;
using System.Collections.Generic;
using System.Text;

namespace JovenVision.Domain.Entities
{
    public abstract class EntityBase
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}

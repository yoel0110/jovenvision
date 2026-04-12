using JovenVision.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace JovenVision.Infrastructure.Context
{
    public class JovenVisionDbContext: DbContext
    {
        public JovenVisionDbContext(DbContextOptions<JovenVisionDbContext> context): base(context)
        {  
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Attendance> Attendances { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Member> Members { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Tracking> Tracking { get; set; }
    }
}

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
        public DbSet<GroupMember> GroupMembers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<GroupMember>()
                .HasKey(gm => new { gm.GroupId, gm.MemberId });

            modelBuilder.Entity<GroupMember>()
                .HasOne(gm => gm.Group)
                .WithMany(g => g.GroupMembers)
                .HasForeignKey(gm => gm.GroupId);

            modelBuilder.Entity<GroupMember>()
                .HasOne(gm => gm.Member)
                .WithMany(m => m.GroupMembers)
                .HasForeignKey(gm => gm.MemberId);

            modelBuilder.Entity<Event>()
                .HasOne(e => e.Group)
                .WithMany(g => g.Events)
                .HasForeignKey(e => e.GroupId)
                .IsRequired(false);
        }
    }
}

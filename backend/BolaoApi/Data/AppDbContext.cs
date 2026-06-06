using Microsoft.EntityFrameworkCore;
using BolaoApi.Models;

namespace BolaoApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Match> Matches => Set<Match>();
    public DbSet<Prediction> Predictions => Set<Prediction>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<Prediction>()
            .HasIndex(p => new { p.UserId, p.MatchId })
            .IsUnique();

        modelBuilder.Entity<Prediction>()
            .HasOne(p => p.User)
            .WithMany(u => u.Predictions)
            .HasForeignKey(p => p.UserId);

        modelBuilder.Entity<Prediction>()
            .HasOne(p => p.Match)
            .WithMany(m => m.Predictions)
            .HasForeignKey(p => p.MatchId);
    }
}

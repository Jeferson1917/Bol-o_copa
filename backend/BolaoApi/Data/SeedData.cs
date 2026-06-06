using Microsoft.EntityFrameworkCore;
using BolaoApi.Models;

namespace BolaoApi.Data;

public static class SeedData
{
    public static async Task Initialize(IServiceProvider serviceProvider)
    {
        using var context = new AppDbContext(
            serviceProvider.GetRequiredService<DbContextOptions<AppDbContext>>());

        // Ensure database exists
        await context.Database.EnsureCreatedAsync();

        // Seed Admin User
        if (!await context.Users.AnyAsync(u => u.Email == "admin@bolao.com"))
        {
            var adminUser = new User
            {
                Email = "admin@bolao.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                IsAdmin = true,
                PontuacaoTotal = 0
            };
            context.Users.Add(adminUser);
            await context.SaveChangesAsync();
        }   

        // Seed Matches
        if (!await context.Matches.AnyAsync())
        {
            var matches = new List<Match>
            {
                // [RODADA 1]
                new() { TimeA = "México", TimeB = "África do Sul", Rodada = 1, Status = MatchStatus.Agendado, KickOffTime = DateTime.UtcNow.AddHours(2) },
                new() { TimeA = "Coreia do Sul", TimeB = "República Tcheca", Rodada = 1, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 12, 2, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Canadá", TimeB = "Bósnia", Rodada = 1, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 12, 19, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Estados Unidos", TimeB = "Paraguai", Rodada = 1, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 13, 1, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Catar", TimeB = "Suíça", Rodada = 1, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 13, 19, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Brasil", TimeB = "Marrocos", Rodada = 1, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 13, 22, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Haiti", TimeB = "Escócia", Rodada = 1, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 14, 1, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Austrália", TimeB = "Turquia", Rodada = 1, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 14, 4, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Alemanha", TimeB = "Curaçao", Rodada = 1, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 14, 17, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Costa do Marfim", TimeB = "Equador", Rodada = 1, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 14, 23, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Holanda", TimeB = "Japão", Rodada = 1, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 14, 20, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Suécia", TimeB = "Tunísia", Rodada = 1, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 15, 2, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Espanha", TimeB = "Cabo Verde", Rodada = 1, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 15, 16, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Arábia Saudita", TimeB = "Uruguai", Rodada = 1, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 15, 22, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Bélgica", TimeB = "Egito", Rodada = 1, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 15, 19, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Irã", TimeB = "Nova Zelândia", Rodada = 1, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 16, 1, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Áustria", TimeB = "Jordânia", Rodada = 1, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 17, 4, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "França", TimeB = "Senegal", Rodada = 1, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 16, 19, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Iraque", TimeB = "Noruega", Rodada = 1, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 16, 22, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Argentina", TimeB = "Argélia", Rodada = 1, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 17, 1, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Portugal", TimeB = "RD Congo", Rodada = 1, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 17, 17, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Inglaterra", TimeB = "Croácia", Rodada = 1, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 17, 20, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Gana", TimeB = "Panamá", Rodada = 1, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 17, 23, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Uzbequistão", TimeB = "Colômbia", Rodada = 1, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 18, 0, 0, 0, DateTimeKind.Utc) },

                // [RODADA 2]
                new() { TimeA = "República Tcheca", TimeB = "África do Sul", Rodada = 2, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 18, 16, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Suíça", TimeB = "Bósnia", Rodada = 2, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 18, 19, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Canadá", TimeB = "Catar", Rodada = 2, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 18, 22, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "México", TimeB = "Coreia do Sul", Rodada = 2, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 19, 1, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Turquia", TimeB = "Paraguai", Rodada = 2, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 19, 3, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Estados Unidos", TimeB = "Austrália", Rodada = 2, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 19, 19, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Escócia", TimeB = "Marrocos", Rodada = 2, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 19, 22, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Brasil", TimeB = "Haiti", Rodada = 2, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 20, 0, 30, 0, DateTimeKind.Utc) },
                new() { TimeA = "Tunísia", TimeB = "Japão", Rodada = 2, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 21, 2, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Holanda", TimeB = "Suécia", Rodada = 2, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 20, 17, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Alemanha", TimeB = "Costa do Marfim", Rodada = 2, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 20, 20, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Equador", TimeB = "Curaçao", Rodada = 2, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 21, 0, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Espanha", TimeB = "Arábia Saudita", Rodada = 2, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 21, 16, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Bélgica", TimeB = "Irã", Rodada = 2, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 21, 19, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Uruguai", TimeB = "Cabo Verde", Rodada = 2, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 21, 22, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Nova Zelândia", TimeB = "Egito", Rodada = 2, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 22, 1, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Argentina", TimeB = "Áustria", Rodada = 2, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 22, 17, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "França", TimeB = "Iraque", Rodada = 2, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 22, 21, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Noruega", TimeB = "Senegal", Rodada = 2, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 23, 0, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Jordânia", TimeB = "Argélia", Rodada = 2, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 23, 3, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Portugal", TimeB = "Uzbequistão", Rodada = 2, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 23, 17, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Inglaterra", TimeB = "Gana", Rodada = 2, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 23, 20, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Panamá", TimeB = "Croácia", Rodada = 2, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 23, 23, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Colômbia", TimeB = "RD Congo", Rodada = 2, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 24, 2, 0, 0, DateTimeKind.Utc) },

                // [RODADA 3]
                new() { TimeA = "Suíça", TimeB = "Canadá", Rodada = 3, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 24, 19, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Bósnia", TimeB = "Catar", Rodada = 3, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 24, 19, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Escócia", TimeB = "Brasil", Rodada = 3, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 24, 22, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Marrocos", TimeB = "Haiti", Rodada = 3, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 24, 22, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "República Tcheca", TimeB = "México", Rodada = 3, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 25, 1, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "África do Sul", TimeB = "Coreia do Sul", Rodada = 3, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 25, 1, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Equador", TimeB = "Alemanha", Rodada = 3, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 25, 20, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Curaçao", TimeB = "Costa do Marfim", Rodada = 3, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 25, 20, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Japão", TimeB = "Suécia", Rodada = 3, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 25, 23, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Tunísia", TimeB = "Holanda", Rodada = 3, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 25, 23, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Turquia", TimeB = "Estados Unidos", Rodada = 3, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 26, 2, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Paraguai", TimeB = "Austrália", Rodada = 3, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 26, 2, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Noruega", TimeB = "França", Rodada = 3, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 26, 19, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Senegal", TimeB = "Iraque", Rodada = 3, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 26, 19, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Cabo Verde", TimeB = "Arábia Saudita", Rodada = 3, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 27, 0, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Uruguai", TimeB = "Espanha", Rodada = 3, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 27, 0, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Egito", TimeB = "Irã", Rodada = 3, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 27, 3, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Nova Zelândia", TimeB = "Bélgica", Rodada = 3, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 27, 3, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Panamá", TimeB = "Inglaterra", Rodada = 3, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 27, 21, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Croácia", TimeB = "Gana", Rodada = 3, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 27, 21, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Colômbia", TimeB = "Portugal", Rodada = 3, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 27, 23, 30, 0, DateTimeKind.Utc) },
                new() { TimeA = "RD Congo", TimeB = "Uzbequistão", Rodada = 3, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 27, 23, 30, 0, DateTimeKind.Utc) },
                new() { TimeA = "Argélia", TimeB = "Áustria", Rodada = 3, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 28, 2, 0, 0, DateTimeKind.Utc) },
                new() { TimeA = "Jordânia", TimeB = "Argentina", Rodada = 3, Status = MatchStatus.Agendado, KickOffTime = new DateTime(2026, 6, 29, 2, 0, 0, DateTimeKind.Utc) }
            };

            await context.Matches.AddRangeAsync(matches);
            await context.SaveChangesAsync();
        }
    }
}

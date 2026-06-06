using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BolaoApi.Data;
using BolaoApi.DTOs;

namespace BolaoApi.Controllers;

[Authorize]
[ApiController]
[Route("api/ranking")]
public class RankingController : ControllerBase
{
    private readonly AppDbContext _context;

    public RankingController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetRanking()
    {
        var users = await _context.Users
            .OrderByDescending(u => u.PontuacaoTotal)
            .ThenBy(u => u.Email)
            .ToListAsync();

        var ranking = users.Select((u, index) => new RankingEntry(
            Position: index + 1,
            Email: u.Email,
            PontuacaoTotal: u.PontuacaoTotal
        )).ToList();

        return Ok(ranking);
    }
}

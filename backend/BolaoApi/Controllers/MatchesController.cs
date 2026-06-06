using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BolaoApi.Data;
using BolaoApi.DTOs;

namespace BolaoApi.Controllers;

[Authorize]
[ApiController]
[Route("api/matches")]
public class MatchesController : ControllerBase
{
    private readonly AppDbContext _context;

    public MatchesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetMatches([FromQuery] int rodada)
    {
        if (rodada < 1 || rodada > 3)
        {
            return BadRequest(new { Message = "Rodada inválida. Deve ser 1, 2 ou 3." });
        }

        var matches = await _context.Matches
            .Where(m => m.Rodada == rodada)
            .OrderBy(m => m.KickOffTime)
            .ToListAsync();

        if (!matches.Any())
        {
            return Ok(new List<MatchDto>());
        }

        // 24-hour opening lock logic:
        // Round is open only 24 hours before the FIRST game of that round starts.
        var firstGameKickOff = matches.Min(m => m.KickOffTime);
        var isOpen = DateTime.UtcNow >= firstGameKickOff.AddHours(-24);

        var utcNow = DateTime.UtcNow;

        var dtos = matches.Select(m => new MatchDto(
            m.Id,
            m.TimeA,
            m.TimeB,
            m.GolsTimeA,
            m.GolsTimeB,
            m.Rodada,
            m.Status.ToString(),
            m.KickOffTime,
            isOpen,
            utcNow >= m.KickOffTime
        )).ToList();

        return Ok(dtos);
    }
}

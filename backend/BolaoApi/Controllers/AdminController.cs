using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BolaoApi.Data;
using BolaoApi.Models;
using BolaoApi.DTOs;
using BolaoApi.Services;

namespace BolaoApi.Controllers;

[Authorize]
[ApiController]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminController(AppDbContext context)
    {
        _context = context;
    }

    private async Task<bool> IsCurrentUserAdmin()
    {
        var isAdminClaim = User.FindFirst("isAdmin")?.Value;
        if (isAdminClaim == "true") return true;

        // DB Fallback check
        var claim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("sub");
        if (claim != null && int.TryParse(claim.Value, out var id))
        {
            var user = await _context.Users.FindAsync(id);
            return user?.IsAdmin ?? false;
        }

        return false;
    }

    [HttpPost("finalize/{matchId}")]
    public async Task<IActionResult> FinalizeMatch(int matchId, [FromBody] FinalizeMatchRequest request)
    {
        if (!await IsCurrentUserAdmin())
        {
            return Forbid();
        }

        if (request.GolsTimeA < 0 || request.GolsTimeB < 0)
        {
            return BadRequest(new { Message = "Gols não podem ser negativos." });
        }

        var match = await _context.Matches.FindAsync(matchId);
        if (match == null)
        {
            return NotFound(new { Message = "Jogo não encontrado." });
        }

        if (match.Status == MatchStatus.Finalizado)
        {
            return BadRequest(new { Message = "Este jogo já foi finalizado anteriormente." });
        }

        // Run updates inside a single database transaction
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            match.GolsTimeA = request.GolsTimeA;
            match.GolsTimeB = request.GolsTimeB;
            match.Status = MatchStatus.Finalizado;

            // Fetch all predictions for this match, including users
            var predictions = await _context.Predictions
                .Include(p => p.User)
                .Where(p => p.MatchId == matchId)
                .ToListAsync();

            int predictionsCalculated = 0;

            foreach (var pred in predictions)
            {
                int points = ScoringService.CalculatePoints(
                    pred.PalpiteGolsA,
                    pred.PalpiteGolsB,
                    request.GolsTimeA,
                    request.GolsTimeB
                );

                pred.PointsGained = points;
                pred.User.PontuacaoTotal += points;

                predictionsCalculated++;
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(new
            {
                Message = "Jogo finalizado com sucesso.",
                MatchId = match.Id,
                Teams = $"{match.TimeA} {request.GolsTimeA} x {request.GolsTimeB} {match.TimeB}",
                PredictionsCalculated = predictionsCalculated
            });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return StatusCode(500, new { Message = "Erro ao processar o encerramento do jogo.", Details = ex.Message });
        }
    }

    [HttpGet("matches")]
    public async Task<IActionResult> GetAdminMatches()
    {
        if (!await IsCurrentUserAdmin())
        {
            return Forbid();
        }

        var matches = await _context.Matches
            .OrderBy(m => m.KickOffTime)
            .ToListAsync();

        return Ok(matches);
    }
}

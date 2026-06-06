using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BolaoApi.Data;
using BolaoApi.Models;
using BolaoApi.DTOs;

namespace BolaoApi.Controllers;

[Authorize]
[ApiController]
[Route("api/predictions")]
public class PredictionsController : ControllerBase
{
    private readonly AppDbContext _context;

    public PredictionsController(AppDbContext context)
    {
        _context = context;
    }

    private int GetCurrentUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("sub");
        if (claim == null) return 0;
        return int.TryParse(claim.Value, out var id) ? id : 0;
    }

    [HttpGet]
    public async Task<IActionResult> GetPredictions([FromQuery] int rodada)
    {
        if (rodada < 1 || rodada > 3)
        {
            return BadRequest(new { Message = "Rodada inválida. Deve ser 1, 2 ou 3." });
        }

        var userId = GetCurrentUserId();
        if (userId == 0) return Unauthorized();

        var matches = await _context.Matches
            .Where(m => m.Rodada == rodada)
            .OrderBy(m => m.KickOffTime)
            .ToListAsync();

        if (!matches.Any())
        {
            return Ok(new List<PredictionResponse>());
        }

        var matchIds = matches.Select(m => m.Id).ToList();
        var predictions = await _context.Predictions
            .Where(p => p.UserId == userId && matchIds.Contains(p.MatchId))
            .ToDictionaryAsync(p => p.MatchId);

        var utcNow = DateTime.UtcNow;

        var response = matches.Select(m => {
            var hasPrediction = predictions.TryGetValue(m.Id, out var pred);
            return new PredictionResponse(
                hasPrediction ? pred!.Id : 0,
                m.Id,
                m.TimeA,
                m.TimeB,
                m.GolsTimeA,
                m.GolsTimeB,
                hasPrediction ? pred!.PalpiteGolsA : 0,
                hasPrediction ? pred!.PalpiteGolsB : 0,
                hasPrediction ? pred!.PointsGained : 0,
                m.Status.ToString(),
                m.KickOffTime,
                utcNow >= m.KickOffTime
            );
        }).ToList();

        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> SavePrediction([FromBody] PredictionRequest request)
    {
        var userId = GetCurrentUserId();
        if (userId == 0) return Unauthorized();

        var match = await _context.Matches.FindAsync(request.MatchId);
        if (match == null)
        {
            return NotFound(new { Message = "Jogo não encontrado." });
        }

        var utcNow = DateTime.UtcNow;

        // 1. KickOff Closing Lock: Prediction can only be saved/edited if utcNow < KickOffTime
        if (utcNow >= match.KickOffTime)
        {
            return BadRequest(new { Message = "Este jogo já começou ou encerrou. Palpites estão fechados." });
        }

        // 2. 24-Hour Opening Lock: Round games are only open 24h before the first game of that round
        var firstGameInRound = await _context.Matches
            .Where(m => m.Rodada == match.Rodada)
            .MinAsync(m => m.KickOffTime);

        if (utcNow < firstGameInRound.AddHours(-24))
        {
            return BadRequest(new { Message = $"Os palpites para a Rodada {match.Rodada} só abrem 24 horas antes do primeiro jogo." });
        }

        // Check if prediction already exists
        var prediction = await _context.Predictions
            .FirstOrDefaultAsync(p => p.UserId == userId && p.MatchId == request.MatchId);

        if (prediction == null)
        {
            prediction = new Prediction
            {
                UserId = userId,
                MatchId = request.MatchId,
                PalpiteGolsA = request.PalpiteGolsA,
                PalpiteGolsB = request.PalpiteGolsB,
                PointsGained = 0
            };
            _context.Predictions.Add(prediction);
        }
        else
        {
            prediction.PalpiteGolsA = request.PalpiteGolsA;
            prediction.PalpiteGolsB = request.PalpiteGolsB;
        }

        await _context.SaveChangesAsync();

        return Ok(new PredictionResponse(
            prediction.Id,
            match.Id,
            match.TimeA,
            match.TimeB,
            match.GolsTimeA,
            match.GolsTimeB,
            prediction.PalpiteGolsA,
            prediction.PalpiteGolsB,
            prediction.PointsGained,
            match.Status.ToString(),
            match.KickOffTime,
            utcNow >= match.KickOffTime
        ));
    }

    // Get predictions of other users (privacy restriction check)
    [HttpGet("match/{matchId}")]
    public async Task<IActionResult> GetMatchPredictions(int matchId)
    {
        var userId = GetCurrentUserId();
        if (userId == 0) return Unauthorized();

        var match = await _context.Matches.FindAsync(matchId);
        if (match == null) return NotFound(new { Message = "Jogo não encontrado." });

        var utcNow = DateTime.UtcNow;
        var list = await _context.Predictions
            .Include(p => p.User)
            .Where(p => p.MatchId == matchId)
            .ToListAsync();

        // Privacy rule: "O sistema não pode retornar os palpites de outros usuários via API antes que a bola role (KickOffTime)."
        var showOthers = utcNow >= match.KickOffTime;

        var result = list.Select(p => new {
            UserName = p.UserId == userId ? "Você" : p.User.Email,
            PalpiteGolsA = (p.UserId == userId || showOthers) ? p.PalpiteGolsA : (int?)null,
            PalpiteGolsB = (p.UserId == userId || showOthers) ? p.PalpiteGolsB : (int?)null,
            p.PointsGained,
            IsOwn = p.UserId == userId
        }).ToList();

        return Ok(result);
    }
}

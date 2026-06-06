namespace BolaoApi.DTOs;

public record PredictionRequest(int MatchId, int PalpiteGolsA, int PalpiteGolsB);

public record PredictionResponse(
    int Id,
    int MatchId,
    string TimeA,
    string TimeB,
    int? GolsTimeA,
    int? GolsTimeB,
    int PalpiteGolsA,
    int PalpiteGolsB,
    int PointsGained,
    string Status,
    DateTime KickOffTime,
    bool IsLocked
);

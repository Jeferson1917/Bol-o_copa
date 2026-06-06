namespace BolaoApi.DTOs;

public record MatchDto(
    int Id,
    string TimeA,
    string TimeB,
    int? GolsTimeA,
    int? GolsTimeB,
    int Rodada,
    string Status,
    DateTime KickOffTime,
    bool IsOpen,
    bool IsLocked
);

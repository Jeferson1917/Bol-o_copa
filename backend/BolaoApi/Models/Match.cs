using System.Text.Json.Serialization;

namespace BolaoApi.Models;

public class Match
{
    public int Id { get; set; }
    public string TimeA { get; set; } = string.Empty;
    public string TimeB { get; set; } = string.Empty;
    public int? GolsTimeA { get; set; }
    public int? GolsTimeB { get; set; }
    public int Rodada { get; set; }
    public MatchStatus Status { get; set; } = MatchStatus.Agendado;
    public DateTime KickOffTime { get; set; }

    [JsonIgnore]
    public List<Prediction> Predictions { get; set; } = new();
}

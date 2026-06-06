namespace BolaoApi.Models;

public class Prediction
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public int MatchId { get; set; }
    public Match Match { get; set; } = null!;
    public int PalpiteGolsA { get; set; }
    public int PalpiteGolsB { get; set; }
    public int PointsGained { get; set; }
}

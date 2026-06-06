using System.Text.Json.Serialization;

namespace BolaoApi.Models;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public int PontuacaoTotal { get; set; }
    public bool IsAdmin { get; set; }

    [JsonIgnore]
    public List<Prediction> Predictions { get; set; } = new();
}

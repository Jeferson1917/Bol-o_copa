namespace BolaoApi.DTOs;

public record LoginRequest(string Email, string Password);
public record RegisterRequest(string Email, string Password);
public record AuthResponse(string Token, int UserId, string Email, bool IsAdmin);

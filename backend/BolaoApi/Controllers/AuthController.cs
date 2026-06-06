using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BolaoApi.Data;
using BolaoApi.Models;
using BolaoApi.DTOs;
using BolaoApi.Services;

namespace BolaoApi.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly TokenService _tokenService;

    public AuthController(AppDbContext context, TokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { Message = "Email e senha são obrigatórios." });
        }

        var emailLower = request.Email.Trim().ToLower();

        if (await _context.Users.AnyAsync(u => u.Email == emailLower))
        {
            return BadRequest(new { Message = "Este email já está cadastrado." });
        }

        var user = new User
        {
            Email = emailLower,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            IsAdmin = false,
            PontuacaoTotal = 0
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var token = _tokenService.GenerateToken(user);
        return Ok(new AuthResponse(token, user.Id, user.Email, user.IsAdmin));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { Message = "Email e senha são obrigatórios." });
        }

        var emailLower = request.Email.Trim().ToLower();
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == emailLower);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return BadRequest(new { Message = "Email ou senha incorretos." });
        }

        var token = _tokenService.GenerateToken(user);
        return Ok(new AuthResponse(token, user.Id, user.Email, user.IsAdmin));
    }
}

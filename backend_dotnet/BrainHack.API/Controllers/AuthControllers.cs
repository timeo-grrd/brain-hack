using BrainHack.API.DTOs;
using BrainHack.API.Services;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace BrainHack.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private static readonly EmailAddressAttribute EmailValidator = new();
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Pseudo)
                || string.IsNullOrWhiteSpace(dto.Email)
                || string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest(new { message = "Tous les champs sont requis" });

            if (!EmailValidator.IsValid(dto.Email?.Trim()))
                return BadRequest(new { message = "Adresse email invalide" });

            var result = await _authService.Register(dto);

            if (result == null)
                return Conflict(new { message = "Cet email est déjà utilisé" });

            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest(new { message = "Email et mot de passe requis" });

            if (!EmailValidator.IsValid(dto.Email?.Trim()))
                return BadRequest(new { message = "Adresse email invalide" });

            var result = await _authService.Login(dto);

            if (result == null)
                return Unauthorized(new { message = "Email ou mot de passe incorrect" });

            return Ok(result);
        }
    }
}
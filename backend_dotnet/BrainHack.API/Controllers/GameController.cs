using BrainHack.API.DTOs;
using BrainHack.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BrainHack.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class GameController : ControllerBase
    {
        private readonly GameService _gameService;

        public GameController(GameService gameService)
        {
            _gameService = gameService;
        }

        [HttpPost("session")]
        public async Task<IActionResult> SaveGameSession([FromBody] SaveGameSessionDTO dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized(new { message = "Utilisateur non authentifie" });
            }

            if (string.IsNullOrWhiteSpace(dto.MinigameId))
            {
                return BadRequest(new { message = "minigame_id requis" });
            }

            var saved = await _gameService.SaveGameSession(userId, dto);
            if (saved == null)
            {
                return BadRequest(new { message = "Impossible d'enregistrer la session" });
            }

            return Ok(saved);
        }
    }
}

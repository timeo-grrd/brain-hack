using BrainHack.API.DTOs;
using BrainHack.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BrainHack.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }

        [HttpPut("avatar")]
        [Authorize]
        public async Task<IActionResult> UpdateAvatar([FromBody] UpdateAvatarDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.AvatarUrl))
            {
                return BadRequest(new { message = "avatar_url requis" });
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized(new { message = "Utilisateur non authentifie" });
            }

            var updated = await _userService.UpdateAvatar(userId, dto.AvatarUrl.Trim());
            if (updated == null)
            {
                return NotFound(new { message = "Utilisateur introuvable" });
            }

            return Ok(new
            {
                id = updated.Id,
                avatar_url = updated.AvatarUrl
            });
        }

        [HttpGet("leaderboard")]
        [AllowAnonymous]
        public async Task<IActionResult> GetLeaderboard()
        {
            var leaderboard = await _userService.GetLeaderboard();
            return Ok(leaderboard);
        }
    }
}

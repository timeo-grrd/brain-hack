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

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized(new { message = "Utilisateur non authentifie" });
            }

            var user = await _userService.GetById(userId);
            if (user == null)
            {
                return NotFound(new { message = "Utilisateur introuvable" });
            }

            var avatarDisplayUrl = await _userService.ResolveAvatarUrlForClient(user.AvatarUrl);

            return Ok(new
            {
                id = user.Id,
                pseudo = user.Pseudo,
                email = user.Email,
                role = user.Role,
                avatar_url = avatarDisplayUrl,
                total_xp = user.TotalXp
            });
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

            var avatarDisplayUrl = await _userService.ResolveAvatarUrlForClient(updated.AvatarUrl);

            return Ok(new
            {
                id = updated.Id,
                avatar_url = avatarDisplayUrl
            });
        }

        [HttpPost("avatar/upload")]
        [Authorize]
        [RequestSizeLimit(5 * 1024 * 1024)]
        public async Task<IActionResult> UploadAvatar([FromForm] IFormFile? avatar)
        {
            var file = avatar ?? Request.Form.Files.FirstOrDefault();
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "Fichier avatar requis" });
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized(new { message = "Utilisateur non authentifie" });
            }

            var updated = await _userService.UploadAvatar(userId, file);
            if (!updated.IsSuccess || updated.User == null)
            {
                return BadRequest(new { message = updated.Error ?? "Impossible de televerser l'avatar" });
            }

            var avatarDisplayUrl = await _userService.ResolveAvatarUrlForClient(updated.User.AvatarUrl);

            return Ok(new
            {
                id = updated.User.Id,
                avatar_url = avatarDisplayUrl
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

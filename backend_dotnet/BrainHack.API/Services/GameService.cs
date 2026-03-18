using BrainHack.API.DTOs;
using BrainHack.API.Models;

namespace BrainHack.API.Services
{
    public class GameService
    {
        private readonly Supabase.Client _supabase;

        public GameService(Supabase.Client supabase)
        {
            _supabase = supabase;
        }

        public async Task<GameSessionResponseDTO?> SaveGameSession(string userId, SaveGameSessionDTO dto)
        {
            var userResponse = await _supabase
                .From<User>()
                .Where(u => u.Id == userId)
                .Get();

            var user = userResponse.Models.FirstOrDefault();
            if (user == null)
            {
                return null;
            }

            var minigameResponse = await _supabase
                .From<MiniGame>()
                .Where(m => m.Id == dto.MinigameId)
                .Get();

            if (!minigameResponse.Models.Any())
            {
                return null;
            }

            var session = new GameSession
            {
                Id = Guid.NewGuid().ToString(),
                UserId = userId,
                MinigameId = dto.MinigameId,
                Score = dto.Score,
                XpEarned = dto.XpEarned,
                CompletedAt = DateTime.UtcNow
            };

            var insertResponse = await _supabase.From<GameSession>().Insert(session);
            var inserted = insertResponse.Models.FirstOrDefault();
            if (inserted == null)
            {
                return null;
            }

            user.TotalXp += dto.XpEarned;
            var userUpdate = await _supabase.From<User>().Update(user);
            var updatedUser = userUpdate.Models.FirstOrDefault();
            if (updatedUser == null)
            {
                return null;
            }

            return new GameSessionResponseDTO
            {
                SessionId = inserted.Id,
                UserId = inserted.UserId,
                MinigameId = inserted.MinigameId,
                Score = inserted.Score,
                XpEarned = inserted.XpEarned,
                CompletedAt = inserted.CompletedAt,
                UpdatedTotalXp = updatedUser.TotalXp
            };
        }
    }
}

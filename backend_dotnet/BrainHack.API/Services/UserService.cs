using BrainHack.API.DTOs;
using BrainHack.API.Models;
using Supabase.Postgrest.Constants;

namespace BrainHack.API.Services
{
    public class UserService
    {
        private readonly Supabase.Client _supabase;

        public UserService(Supabase.Client supabase)
        {
            _supabase = supabase;
        }

        public async Task<User?> UpdateAvatar(string userId, string avatarUrl)
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

            user.AvatarUrl = avatarUrl;
            var updatedResponse = await _supabase.From<User>().Update(user);
            return updatedResponse.Models.FirstOrDefault();
        }

        public async Task<List<LeaderboardUserDTO>> GetLeaderboard()
        {
            var response = await _supabase
                .From<User>()
                .Where(u => u.Role == "student")
                .Order("total_xp", Ordering.Descending)
                .Get();

            return response.Models.Select(u => new LeaderboardUserDTO
            {
                Id = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,
                AvatarUrl = u.AvatarUrl,
                TotalXp = u.TotalXp
            }).ToList();
        }
    }
}

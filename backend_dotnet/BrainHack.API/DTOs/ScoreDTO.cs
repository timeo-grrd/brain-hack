namespace BrainHack.API.DTOs
{
    public class SaveGameSessionDTO
    {
        public string MinigameId { get; set; } = string.Empty;
        public int Score { get; set; }
        public int XpEarned { get; set; }
    }

    public class GameSessionResponseDTO
    {
        public string SessionId { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string MinigameId { get; set; } = string.Empty;
        public int Score { get; set; }
        public int XpEarned { get; set; }
        public DateTime CompletedAt { get; set; }
        public int UpdatedTotalXp { get; set; }
    }

    public class LeaderboardUserDTO
    {
        public string Id { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? AvatarUrl { get; set; }
        public int TotalXp { get; set; }
    }
}
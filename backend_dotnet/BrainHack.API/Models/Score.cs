using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace BrainHack.API.Models
{
    [Table("gamesessions")]
    public class GameSession : BaseModel
    {
        [PrimaryKey("id", false)]
        public string Id { get; set; } = string.Empty;

        [Column("user_id")]
        public string UserId { get; set; } = string.Empty;

        [Column("minigame_id")]
        public string MinigameId { get; set; } = string.Empty;

        [Column("score")]
        public int Score { get; set; }

        [Column("xp_earned")]
        public int XpEarned { get; set; }

        [Column("completed_at")]
        public DateTime CompletedAt { get; set; } = DateTime.UtcNow;
    }
}
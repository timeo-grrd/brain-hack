using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace BrainHack.API.Models
{
    [Table("users")]
    public class User : BaseModel
    {
        [PrimaryKey("id", false)]
        public string Id { get; set; } = string.Empty;

        [Column("email")]
        public string Email { get; set; } = string.Empty;

        [Column("password_hash")]
        public string PasswordHash { get; set; } = string.Empty;

        [Column("first_name")]
        public string FirstName { get; set; } = string.Empty;

        [Column("last_name")]
        public string LastName { get; set; } = string.Empty;

        [Column("role")]
        public string Role { get; set; } = "student";

        [Column("avatar_url")]
        public string? AvatarUrl { get; set; }

        [Column("total_xp")]
        public int TotalXp { get; set; } = 0;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
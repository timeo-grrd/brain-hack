using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace BrainHack.API.Models
{
    [Table("minigames")]
    public class MiniGame : BaseModel
    {
        [PrimaryKey("id", false)]
        public string Id { get; set; } = string.Empty;

        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [Column("description")]
        public string? Description { get; set; }

        [Column("max_xp_possible")]
        public int MaxXpPossible { get; set; }
    }
}
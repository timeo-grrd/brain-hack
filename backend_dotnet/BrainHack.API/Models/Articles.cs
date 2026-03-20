using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace BrainHack.API.Models
{
    [Table("articles")]
    public class Article : BaseModel
    {
        [PrimaryKey("id", false)]
        public string Id { get; set; } = string.Empty;

        [Column("title")]
        public string Title { get; set; } = string.Empty;

        [Column("intro")]
        public object Intro { get; set; } = new List<object>();

        [Column("sections")]
        public object Sections { get; set; } = new List<object>();

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }
    }
}
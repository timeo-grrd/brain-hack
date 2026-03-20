using BrainHack.API.Models;

namespace BrainHack.API.Services
{
    public class ArticleService
    {
        private readonly Supabase.Client _supabase;

        public ArticleService(Supabase.Client supabase)
        {
            _supabase = supabase;
        }

        public async Task<Article?> GetByIdAsync(string id)
        {
            var response = await _supabase
                .From<Article>()
                .Where(a => a.Id == id)
                .Get();

            return response.Models.FirstOrDefault();
        }
    }
}
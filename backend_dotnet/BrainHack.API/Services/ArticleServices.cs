using BrainHack.API.Models;
using System.Net.Http.Headers;
using System.Text.Json;

namespace BrainHack.API.Services
{
    public class ArticleService
    {
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;

        public ArticleService(IConfiguration config)
        {
            _config = config;
            _httpClient = new HttpClient();
        }

        public async Task<Article?> GetByIdAsync(string id)
        {
            var supabaseUrl = _config["Supabase:Url"]!;
            var supabaseKey = _config["Supabase:AnonKey"]!;

            var url = $"{supabaseUrl}/rest/v1/articles?id=eq.{id}&select=*";

            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("apikey", supabaseKey);
            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", supabaseKey);

            var response = await _httpClient.GetStringAsync(url);
            var articles = JsonSerializer.Deserialize<List<ArticleRaw>>(response,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            var raw = articles?.FirstOrDefault();
            if (raw == null) return null;

            return new Article
            {
                Id = raw.Id ?? string.Empty,
                Title = raw.Title ?? string.Empty,
                Intro = raw.Intro?.ToString() ?? "[]",
                Sections = raw.Sections?.ToString() ?? "[]"
            };
        }
    }

    public class ArticleRaw
    {
        public string? Id { get; set; }
        public string? Title { get; set; }
        public JsonElement? Intro { get; set; }
        public JsonElement? Sections { get; set; }
    }
}
using BrainHack.API.DTOs;
using BrainHack.API.Models;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using static Supabase.Postgrest.Constants;

namespace BrainHack.API.Services
{
    public sealed class UploadAvatarResult
    {
        public User? User { get; init; }
        public string? Error { get; init; }
        public bool IsSuccess => User != null;
    }

    public class UserService
    {
        private sealed class AvatarStorageLocation
        {
            public string Bucket { get; init; } = string.Empty;
            public string ObjectPath { get; init; } = string.Empty;
        }

        private readonly Supabase.Client _supabase;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _config;

        public UserService(Supabase.Client supabase, IHttpClientFactory httpClientFactory, IConfiguration config)
        {
            _supabase = supabase;
            _httpClientFactory = httpClientFactory;
            _config = config;
        }

        private string? GetSupabaseUrl()
            => (_config["SUPABASE_URL"] ?? _config["Supabase:Url"])?.TrimEnd('/');

        private string? GetSupabaseKey()
            => _config["SUPABASE_KEY"] ?? _config["Supabase:ServiceRoleKey"] ?? _config["Supabase:AnonKey"];

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

        public async Task<User?> GetById(string userId)
        {
            var userResponse = await _supabase
                .From<User>()
                .Where(u => u.Id == userId)
                .Get();

            return userResponse.Models.FirstOrDefault();
        }

        public async Task<string?> ResolveAvatarUrlForClient(string? avatarUrl)
        {
            if (string.IsNullOrWhiteSpace(avatarUrl))
            {
                return avatarUrl;
            }

            if (!TryParseAvatarStorageLocation(avatarUrl, out var location) || location == null)
            {
                return avatarUrl;
            }

            var signed = await CreateSignedAvatarUrl(location.Bucket, location.ObjectPath, 3600);
            if (!string.IsNullOrWhiteSpace(signed))
            {
                return signed;
            }

            return BuildPublicAvatarUrl(location.Bucket, location.ObjectPath) ?? avatarUrl;
        }

        public async Task<UploadAvatarResult> UploadAvatar(string userId, IFormFile avatarFile)
        {
            var currentUser = await GetById(userId);
            if (currentUser == null)
            {
                return new UploadAvatarResult { Error = "Utilisateur introuvable." };
            }

            if (avatarFile.Length == 0 || avatarFile.Length > 5 * 1024 * 1024)
            {
                return new UploadAvatarResult { Error = "Image invalide: taille max 5 Mo." };
            }

            var contentType = (avatarFile.ContentType ?? string.Empty).Trim().ToLowerInvariant();
            var extension = contentType switch
            {
                "image/jpeg" => ".jpg",
                "image/jpg" => ".jpg",
                "image/png" => ".png",
                "image/webp" => ".webp",
                _ => string.Empty
            };

            if (string.IsNullOrEmpty(extension))
            {
                var fileExtension = Path.GetExtension(avatarFile.FileName ?? string.Empty).ToLowerInvariant();
                if (fileExtension is ".jpg" or ".jpeg") extension = ".jpg";
                else if (fileExtension == ".png") extension = ".png";
                else if (fileExtension == ".webp") extension = ".webp";
            }

            if (string.IsNullOrEmpty(extension))
            {
                return new UploadAvatarResult { Error = "Format non supporte. Utilise JPG, PNG ou WEBP." };
            }

            var supabaseUrl = GetSupabaseUrl();
            var supabaseKey = GetSupabaseKey();
            var bucketName = _config["Supabase:AvatarBucket"] ?? "avatars";
            if (string.IsNullOrWhiteSpace(supabaseUrl) || string.IsNullOrWhiteSpace(supabaseKey))
            {
                return new UploadAvatarResult { Error = "Configuration Supabase manquante (Url/cle)." };
            }

            var objectPath = $"users/{userId}/avatar_{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}{extension}";
            var uploadUrl = $"{supabaseUrl}/storage/v1/object/{bucketName}/{objectPath}";

            using var stream = avatarFile.OpenReadStream();
            var httpClient = _httpClientFactory.CreateClient();
            var bytes = await ReadAllBytesAsync(stream);

            var (success, uploadError) = await TryUploadToSupabase(httpClient, uploadUrl, supabaseKey, contentType, bytes, HttpMethod.Post);
            if (!success)
            {
                var fallbackTry = await TryUploadToSupabase(httpClient, uploadUrl, supabaseKey, contentType, bytes, HttpMethod.Put);
                success = fallbackTry.success;
                uploadError = fallbackTry.error;
            }

            if (!success)
            {
                return new UploadAvatarResult { Error = uploadError ?? "Echec upload bucket avatars." };
            }

            var publicUrl = $"{supabaseUrl}/storage/v1/object/public/{bucketName}/{objectPath}";
            var updatedUser = await UpdateAvatar(userId, publicUrl);
            if (updatedUser == null)
            {
                return new UploadAvatarResult { Error = "Upload ok mais mise a jour profil impossible." };
            }

            await DeletePreviousAvatarIfNeeded(currentUser.AvatarUrl, bucketName, objectPath);

            return new UploadAvatarResult { User = updatedUser };
        }

        private static async Task<byte[]> ReadAllBytesAsync(Stream stream)
        {
            using var memory = new MemoryStream();
            await stream.CopyToAsync(memory);
            return memory.ToArray();
        }

        private static async Task<(bool success, string? error)> TryUploadToSupabase(
            HttpClient httpClient,
            string uploadUrl,
            string supabaseKey,
            string contentType,
            byte[] fileBytes,
            HttpMethod method)
        {
            using var content = new ByteArrayContent(fileBytes);
            content.Headers.ContentType = new MediaTypeHeaderValue(contentType);

            using var request = new HttpRequestMessage(method, uploadUrl)
            {
                Content = content
            };

            request.Headers.Add("apikey", supabaseKey);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", supabaseKey);
            request.Headers.Add("x-upsert", "true");

            var response = await httpClient.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                return (true, null);
            }

            var details = await response.Content.ReadAsStringAsync();
            var compactDetails = string.IsNullOrWhiteSpace(details) ? string.Empty : $" Details: {details}";
            return (false, $"Storage HTTP {(int)response.StatusCode}.{compactDetails}");
        }

        private async Task DeletePreviousAvatarIfNeeded(string? previousAvatarUrl, string newBucket, string newObjectPath)
        {
            if (!TryParseAvatarStorageLocation(previousAvatarUrl, out var oldLocation) || oldLocation == null)
            {
                return;
            }

            if (oldLocation.Bucket == newBucket && oldLocation.ObjectPath == newObjectPath)
            {
                return;
            }

            var supabaseUrl = GetSupabaseUrl();
            var supabaseKey = GetSupabaseKey();
            if (string.IsNullOrWhiteSpace(supabaseUrl) || string.IsNullOrWhiteSpace(supabaseKey))
            {
                return;
            }

            var encodedPath = Uri.EscapeDataString(oldLocation.ObjectPath).Replace("%2F", "/");
            var deleteUrl = $"{supabaseUrl}/storage/v1/object/{oldLocation.Bucket}/{encodedPath}";

            using var request = new HttpRequestMessage(HttpMethod.Delete, deleteUrl);
            request.Headers.Add("apikey", supabaseKey);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", supabaseKey);

            var httpClient = _httpClientFactory.CreateClient();
            try
            {
                await httpClient.SendAsync(request);
            }
            catch
            {
                // Non bloquant: on ne casse pas la mise à jour de profil si le nettoyage échoue.
            }
        }

        private async Task<string?> CreateSignedAvatarUrl(string bucket, string objectPath, int expiresInSeconds)
        {
            var supabaseUrl = GetSupabaseUrl();
            var supabaseKey = GetSupabaseKey();
            if (string.IsNullOrWhiteSpace(supabaseUrl) || string.IsNullOrWhiteSpace(supabaseKey))
            {
                return null;
            }

            var encodedPath = Uri.EscapeDataString(objectPath).Replace("%2F", "/");
            var signUrl = $"{supabaseUrl}/storage/v1/object/sign/{bucket}/{encodedPath}";

            using var request = new HttpRequestMessage(HttpMethod.Post, signUrl);
            request.Headers.Add("apikey", supabaseKey);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", supabaseKey);
            request.Content = new StringContent(
                JsonSerializer.Serialize(new { expiresIn = expiresInSeconds }),
                Encoding.UTF8,
                "application/json"
            );

            var httpClient = _httpClientFactory.CreateClient();
            var response = await httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                return null;
            }

            var payload = await response.Content.ReadAsStringAsync();
            if (string.IsNullOrWhiteSpace(payload))
            {
                return null;
            }

            using var document = JsonDocument.Parse(payload);
            if (!document.RootElement.TryGetProperty("signedURL", out var signedElement)
                && !document.RootElement.TryGetProperty("signedUrl", out signedElement))
            {
                return null;
            }

            var signedValue = signedElement.GetString();
            if (string.IsNullOrWhiteSpace(signedValue))
            {
                return null;
            }

            if (signedValue.StartsWith("http://", StringComparison.OrdinalIgnoreCase)
                || signedValue.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
            {
                return signedValue;
            }

            if (signedValue.StartsWith('/'))
            {
                return $"{supabaseUrl}/storage/v1{signedValue}";
            }

            return $"{supabaseUrl}/storage/v1/{signedValue}";
        }

        private string? BuildPublicAvatarUrl(string bucket, string objectPath)
        {
            var supabaseUrl = GetSupabaseUrl();
            if (string.IsNullOrWhiteSpace(supabaseUrl))
            {
                return null;
            }

            return $"{supabaseUrl}/storage/v1/object/public/{bucket}/{objectPath}";
        }

        private bool TryParseAvatarStorageLocation(string? avatarUrl, out AvatarStorageLocation? location)
        {
            location = null;
            var raw = avatarUrl?.Trim();
            if (string.IsNullOrWhiteSpace(raw))
            {
                return false;
            }

            if (raw.StartsWith("../assets/", StringComparison.OrdinalIgnoreCase)
                || raw.StartsWith("./assets/", StringComparison.OrdinalIgnoreCase)
                || raw.StartsWith("/assets/", StringComparison.OrdinalIgnoreCase))
            {
                return false;
            }

            var defaultBucket = (_config["Supabase:AvatarBucket"] ?? "avatars").Trim();

            if (!Uri.TryCreate(raw, UriKind.Absolute, out var uri))
            {
                var normalized = raw.TrimStart('/');
                location = new AvatarStorageLocation { Bucket = defaultBucket, ObjectPath = normalized };
                return true;
            }

            var supabaseUrl = GetSupabaseUrl();
            if (!string.IsNullOrWhiteSpace(supabaseUrl)
                && Uri.TryCreate(supabaseUrl, UriKind.Absolute, out var supabaseUri)
                && !string.Equals(uri.Host, supabaseUri.Host, StringComparison.OrdinalIgnoreCase))
            {
                return false;
            }

            var segments = uri.AbsolutePath.Split('/', StringSplitOptions.RemoveEmptyEntries);
            var objectIndex = Array.FindIndex(segments, s => s.Equals("object", StringComparison.OrdinalIgnoreCase));
            if (objectIndex < 0 || objectIndex + 2 >= segments.Length)
            {
                return false;
            }

            var mode = segments[objectIndex + 1].ToLowerInvariant();
            int bucketIndex;
            if (mode == "public" || mode == "sign") bucketIndex = objectIndex + 2;
            else bucketIndex = objectIndex + 1;

            if (bucketIndex >= segments.Length)
            {
                return false;
            }

            var bucket = segments[bucketIndex];
            var objectParts = segments.Skip(bucketIndex + 1).Select(Uri.UnescapeDataString);
            var objectPath = string.Join('/', objectParts);
            if (string.IsNullOrWhiteSpace(objectPath))
            {
                return false;
            }

            location = new AvatarStorageLocation { Bucket = bucket, ObjectPath = objectPath };
            return true;
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
                Pseudo = u.Pseudo,
                AvatarUrl = u.AvatarUrl,
                TotalXp = u.TotalXp
            }).ToList();
        }
    }
}
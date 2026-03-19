using BrainHack.API.DTOs;
using BrainHack.API.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BrainHack.API.Services
{
    public class AuthService
    {
        private static readonly string[] DefaultAvatarPool =
        {
            "../assets/greenAvatar.png",
            "../assets/blueAvatar.png",
            "../assets/redAvatar.png",
            "../assets/yellowAvatar.png",
            "../assets/purpleAvatar.png",
            "../assets/orangeAvatar.png",
            "../assets/cyanAvatar.png",
            "../assets/pinkAvatar.png",
            "../assets/limeAvatar.png"
        };

        private readonly Supabase.Client _supabase;
        private readonly IConfiguration _config;

        public AuthService(Supabase.Client supabase, IConfiguration config)
        {
            _supabase = supabase;
            _config = config;
        }

        public async Task<AuthResponseDTO?> Register(RegisterDTO dto)
        {
            var normalizedEmail = dto.Email.Trim().ToLowerInvariant();
            var normalizedRole = NormalizeRole(dto.Role);
            var avatarUrl = ResolveAvatarUrl(dto.AvatarUrl);

            var existing = await _supabase
                .From<User>()
                .Where(u => u.Email == normalizedEmail)
                .Get();

            if (existing.Models.Any())
                return null;

            var user = new User
            {
                Id = Guid.NewGuid().ToString(),
                Email = normalizedEmail,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Pseudo = dto.Pseudo.Trim(),
                Role = normalizedRole,
                AvatarUrl = avatarUrl,
                TotalXp = 0,
                CreatedAt = DateTime.UtcNow
            };

            var response = await _supabase.From<User>().Insert(user);
            if (!response.Models.Any()) return null;
            var created = response.Models.First();

            return new AuthResponseDTO
            {
                Token = GenerateToken(created),
                Id = created.Id,
                Pseudo = created.Pseudo,
                Email = created.Email,
                Role = created.Role,
                AvatarUrl = created.AvatarUrl,
                TotalXp = created.TotalXp
            };
        }

        public async Task<AuthResponseDTO?> Login(LoginDTO dto)
        {
            var normalizedEmail = dto.Email.Trim().ToLowerInvariant();

            var response = await _supabase
                .From<User>()
                .Where(u => u.Email == normalizedEmail)
                .Get();

            var user = response.Models.FirstOrDefault();
            if (user == null) return null;

            var passwordOk = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
            if (!passwordOk) return null;

            return new AuthResponseDTO
            {
                Token = GenerateToken(user),
                Id = user.Id,
                Pseudo = user.Pseudo,
                Email = user.Email,
                Role = user.Role,
                AvatarUrl = user.AvatarUrl,
                TotalXp = user.TotalXp
            };
        }

        private static string NormalizeRole(string role)
        {
            var normalized = role.Trim().ToLowerInvariant();
            return normalized == "teacher" ? "teacher" : "student";
        }

        private static string ResolveAvatarUrl(string? avatarUrl)
        {
            if (!string.IsNullOrWhiteSpace(avatarUrl))
            {
                return avatarUrl.Trim();
            }

            return DefaultAvatarPool[Random.Shared.Next(DefaultAvatarPool.Length)];
        }

        private string GenerateToken(User user)
        {
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Secret"]!)
            );

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("pseudo", user.Pseudo)
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(int.Parse(_config["Jwt:ExpiryInDays"]!)),
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
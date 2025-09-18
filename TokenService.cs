using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Digifair.API.Entities;
using Microsoft.AspNetCore.Identity; // ۱. اضافه کردن using برای UserManager
using Microsoft.IdentityModel.Tokens;
using System.Collections.Generic; // اضافه کردن using برای List
using System.Linq; // اضافه کردن using برای Select
using System.Threading.Tasks; // اضافه کردن using برای Task

namespace Digifair.API.Services
{
    public class TokenService : ITokenService
    {
        private readonly SymmetricSecurityKey _key;
        private readonly IConfiguration _config;
        private readonly UserManager<ApplicationUser> _userManager; // ۲. اضافه کردن UserManager

        // ۳. اضافه کردن UserManager به سازنده (Constructor)
        public TokenService(IConfiguration config, UserManager<ApplicationUser> userManager)
        {
            _config = config;
            _userManager = userManager;
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Token:Key"]!));
        }

        // ۴. تبدیل متد به async Task<string>
        public async Task<string> CreateToken(ApplicationUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.NameId, user.Id),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName!)
            };

            // ۵. بخش کلیدی: دریافت نقش های کاربر و افزودن به توکن
            var roles = await _userManager.GetRolesAsync(user);

            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = creds,
                Issuer = _config["Token:Issuer"]
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}
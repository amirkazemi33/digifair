using Microsoft.AspNetCore.Identity;

namespace Digifair.API.Entities
{
    public class ApplicationUser : IdentityUser
    {
        // فعلا فیلد اضافه ای نیاز نداریم، در آینده میتوانیم اضافه کنیم
        public string? OtpCode { get; set; }
        public DateTime? OtpExpiration { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Address { get; set; }
        public string? Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
    }
}
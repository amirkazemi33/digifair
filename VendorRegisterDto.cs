using System.ComponentModel.DataAnnotations;
namespace Digifair.API.DTOs
{
    public class VendorRegisterDto
    {
        [Required]
        public string PhoneNumber { get; set; } = string.Empty;
        [Required]
        public string StoreName { get; set; } = string.Empty;
        [Required]
        public string LandlineNumber { get; set; } = string.Empty;
        [Required]
        public string Address { get; set; } = string.Empty;
        public string? LogoUrl { get; set; }
    }
}
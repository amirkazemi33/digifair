using System.ComponentModel.DataAnnotations;
namespace Digifair.API.DTOs
{
    public class VerifyOtpDto
    {
        [Required]
        [Phone]
        public string PhoneNumber { get; set; }

        [Required]
        [StringLength(5, MinimumLength = 5)]
        public string OtpCode { get; set; }
    }
}
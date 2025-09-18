using System.ComponentModel.DataAnnotations;
namespace Digifair.API.DTOs
{
    public class GenerateOtpDto
    {
        [Required]
        [Phone]
        public string PhoneNumber { get; set; }
    }
}
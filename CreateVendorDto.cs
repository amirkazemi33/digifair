using System.ComponentModel.DataAnnotations;
namespace Digifair.API.DTOs
{
    public class CreateVendorDto
    {
        [Required]
        public string StoreName { get; set; }
        public string? Description { get; set; }
    }
}
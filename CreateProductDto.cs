using System.ComponentModel.DataAnnotations;
namespace Digifair.API.DTOs
{
    public class CreateProductDto
    {
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
        [Required]
        public decimal Price { get; set; }
        public string? ImageUrl { get; set; }
    }
}
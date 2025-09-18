namespace Digifair.API.Entities
{
    public class Vendor
    {
        public int Id { get; set; }
        public string StoreName { get; set; }
        public string? Description { get; set; }

        // --- فیلدهای جدید ---
        public string? LandlineNumber { get; set; } // شماره تماس ثابت
        public string? Address { get; set; } // آدرس
        public string? LogoUrl { get; set; } // URL لوگو (اختیاری)

        // Foreign Key to link Vendor to a User
        public string ApplicationUserId { get; set; }
        public ApplicationUser ApplicationUser { get; set; }

        // Navigation Property for Products
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
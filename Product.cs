namespace Digifair.API.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string? ImageUrl { get; set; }

        // Foreign Key to Vendor
        public int VendorId { get; set; }
        public Vendor Vendor { get; set; }
    }
}
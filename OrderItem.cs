using System.ComponentModel.DataAnnotations.Schema;

namespace Digifair.API.Entities
{
    public class OrderItem
    {
        public int Id { get; set; }
        public int Quantity { get; set; } // تعداد

        [Column(TypeName = "decimal(18, 2)")]
        public decimal Price { get; set; } // قیمت در زمان خرید

        // ارتباط با محصول
        public int ProductId { get; set; }
        public Product Product { get; set; }

        // ارتباط با سفارش اصلی
        public int OrderId { get; set; }
        public Order Order { get; set; }
    }
}
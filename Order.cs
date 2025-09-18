using System.ComponentModel.DataAnnotations.Schema;

namespace Digifair.API.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        [Column(TypeName = "decimal(18, 2)")]
        public decimal TotalAmount { get; set; }
        public string OrderStatus { get; set; } = "Pending"; // وضعیت سفارش

        // ارتباط با کاربر
        public string ApplicationUserId { get; set; }
        public ApplicationUser ApplicationUser { get; set; }

        // ارتباط با آیتم های سفارش
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
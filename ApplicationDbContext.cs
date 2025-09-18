using Digifair.API.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Digifair.API.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Vendor> Vendors { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        // --- این بخش برای رفع هشدار اضافه شده است ---
        protected override void OnModelCreating(ModelBuilder builder)
        {
            // این خط بسیار مهم است تا تنظیمات پیش فرض Identity به درستی اعمال شوند
            base.OnModelCreating(builder);

            // در اینجا به Entity Framework می گوییم که پراپرتی Price از نوع Product
            // باید در دیتابیس به صورت یک ستون decimal با دقت 18 رقم و 2 رقم اعشار ذخیره شود.
            builder.Entity<Product>()
                .Property(p => p.Price)
                .HasColumnType("decimal(18, 2)");
        }
    }
}
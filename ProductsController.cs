using System.Security.Claims;
using Digifair.API.Data;
using Digifair.API.DTOs;
using Digifair.API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Digifair.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // این متد عمومی است و همه می توانند محصولات را ببینند
        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            var products = await _context.Products.ToListAsync();
            return Ok(products);
        }

        // این متد فقط برای کاربران لاگین کرده (که وندور هستند) قابل دسترس است
        [Authorize] // در مراحل بعد نقش "Vendor" را اضافه کرده و [Authorize(Roles = "Vendor")] می کنیم
        [HttpPost]
        public async Task<IActionResult> CreateProduct(CreateProductDto createProductDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // پیدا کردن پروفایل وندور مربوط به این کاربر
            var vendor = await _context.Vendors.FirstOrDefaultAsync(v => v.ApplicationUserId == userId);
            if (vendor == null)
            {
                return Forbid("You must create a vendor profile first.");
            }

            var product = new Product
            {
                Name = createProductDto.Name,
                Description = createProductDto.Description,
                Price = createProductDto.Price,
                ImageUrl = createProductDto.ImageUrl,
                VendorId = vendor.Id // محصول به وندور لاگین کرده متصل می شود
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return Ok(product);
        }
    }
}
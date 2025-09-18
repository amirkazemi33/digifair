using Digifair.API.Data;
using Digifair.API.DTOs;
using Digifair.API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Digifair.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public OrdersController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder(CreateOrderDto orderDto)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            if (orderDto.OrderItems == null || !orderDto.OrderItems.Any())
            {
                return BadRequest("Order must contain at least one item.");
            }

            var order = new Order { ApplicationUserId = user.Id };
            decimal totalAmount = 0;

            foreach (var itemDto in orderDto.OrderItems)
            {
                var product = await _context.Products.FindAsync(itemDto.ProductId);
                if (product == null) return BadRequest($"Product with Id {itemDto.ProductId} not found.");

                var orderItem = new OrderItem
                {
                    Product = product,
                    Quantity = itemDto.Quantity,
                    Price = product.Price // Current product price
                };
                order.OrderItems.Add(orderItem);
                totalAmount += product.Price * itemDto.Quantity;
            }

            order.TotalAmount = totalAmount;
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return Ok(new { OrderId = order.Id, Message = "Order created successfully." });
        }
    }
}
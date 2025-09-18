using System.Security.Claims;
using Digifair.API.Data;
using Digifair.API.DTOs;
using Digifair.API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity; // This using statement has been added

namespace Digifair.API.Controllers
{
    [ApiController]
    [Route("api/vendors")]
    public class VendorsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager; // UserManager added

        // Constructor updated to accept UserManager
        public VendorsController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: /api/vendors
        // This is a placeholder for getting all vendors; it can be secured as needed.
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Vendor>>> GetAllVendors()
        {
            var vendors = await _context.Vendors.ToListAsync();
            return Ok(vendors);
        }

        // POST: /api/vendors
        // Creates a new vendor profile for the logged-in user and assigns the "Vendor" role.
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateVendorProfile(CreateVendorDto createVendorDto)
        {
            var userId = User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User ID could not be found in token.");
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return Unauthorized(); // User from token does not exist in the database
            }

            var vendorExists = await _context.Vendors.AnyAsync(v => v.ApplicationUserId == userId);
            if (vendorExists)
            {
                return BadRequest("Vendor profile already exists for this user.");
            }

            var vendor = new Vendor
            {
                StoreName = createVendorDto.StoreName,
                Description = createVendorDto.Description,
                ApplicationUserId = userId
            };

            _context.Vendors.Add(vendor);

            // Assign the "Vendor" role to the user if they don't already have it.
            if (!await _userManager.IsInRoleAsync(user, "Vendor"))
            {
                await _userManager.AddToRoleAsync(user, "Vendor");
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetVendorById), new { id = vendor.Id }, vendor);
        }

        // GET: /api/vendors/{id}
        // Gets a specific vendor by their ID.
        [HttpGet("{id}")]
        public async Task<IActionResult> GetVendorById(int id)
        {
            var vendor = await _context.Vendors.FindAsync(id);

            if (vendor == null)
            {
                return NotFound();
            }

            return Ok(vendor);
        }
    }
}
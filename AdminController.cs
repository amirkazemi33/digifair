using Microsoft.AspNetCore.Authorization; 
using Microsoft.AspNetCore.Mvc;       

namespace Digifair.API.Controllers
{
	[ApiController]
	[Route("api/admin")]
	[Authorize(Roles = "Admin")] // این کنترلر فقط برای کاربران با نقش ادمین قابل دسترس است
	public class AdminController : ControllerBase
	{
		[HttpGet("test")]
		public IActionResult AdminOnlyTest()
		{
			return Ok("Welcome, Admin! You have access to this secure endpoint.");
		}
	}
}
using Microsoft.AspNetCore.Mvc;

namespace Digifair.API.Controllers
{
    [ApiController]
    [Route("api/content")]
    public class ContentController : ControllerBase
    {
        private readonly IConfiguration _config;

        public ContentController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet("homepage-banners")]
        public IActionResult GetHomepageBanners()
        {
            var banners = _config.GetSection("HomePageSettings:Banners").Get<object>();
            return Ok(banners);
        }
    }
}
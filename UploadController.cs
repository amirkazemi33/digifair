using Microsoft.AspNetCore.Mvc;

namespace Digifair.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _hostEnvironment;

        public UploadController(IWebHostEnvironment hostEnvironment)
        {
            _hostEnvironment = hostEnvironment;
        }

        [HttpPost]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            // مسیر پوشه آپلودها را پیدا می کند
            var uploadsFolderPath = Path.Combine(_hostEnvironment.WebRootPath, "uploads");

            // اگر پوشه وجود نداشت، آن را می سازد
            if (!Directory.Exists(uploadsFolderPath))
            {
                Directory.CreateDirectory(uploadsFolderPath);
            }

            // یک نام فایل یکتا برای جلوگیری از تداخل ایجاد می کند
            var uniqueFileName = Guid.NewGuid().ToString() + "_" + file.FileName;
            var filePath = Path.Combine(uploadsFolderPath, uniqueFileName);

            // فایل را روی سرور ذخیره می کند
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // آدرس عمومی فایل را برای استفاده در فرانت اند برمی گرداند
            var publicUrl = $"{Request.Scheme}://{Request.Host}/uploads/{uniqueFileName}";

            return Ok(new { url = publicUrl });
        }
    }
}
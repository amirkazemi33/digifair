using Digifair.API.Data;
using Digifair.API.DTOs;
using Digifair.API.Entities;
using Digifair.API.Services;
using Digifair.API.Utilities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Digifair.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        // بهبود شماره ۱: تعریف یک نمونه استاتیک از Random
        private static readonly Random _random = new();

        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ISmsService _smsService;
        private readonly ApplicationDbContext _context;
        private readonly ITokenService _tokenService;

        public AuthController(UserManager<ApplicationUser> userManager, ISmsService smsService, ApplicationDbContext context, ITokenService tokenService)
        {
            _userManager = userManager;
            _smsService = smsService;
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("generate-otp")]
        public async Task<IActionResult> GenerateOtp(GenerateOtpDto generateOtpDto)
        {
            var normalizedPhoneNumber = NumberUtility.NormalizePhoneNumber(generateOtpDto.PhoneNumber);

            if (string.IsNullOrEmpty(normalizedPhoneNumber) || normalizedPhoneNumber.Length != 13)
            {
                return BadRequest("Invalid phone number format.");
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.PhoneNumber == normalizedPhoneNumber);

            if (user == null)
            {
                user = new ApplicationUser
                {
                    UserName = normalizedPhoneNumber,
                    PhoneNumber = normalizedPhoneNumber,
                    PhoneNumberConfirmed = true
                };
                var result = await _userManager.CreateAsync(user);
                if (!result.Succeeded) return BadRequest(result.Errors);
            }

            // بهبود شماره ۱: استفاده از نمونه استاتیک
            var otpCode = _random.Next(10000, 99999).ToString();

            user.OtpCode = otpCode;
            user.OtpExpiration = DateTime.UtcNow.AddMinutes(2);

            await _context.SaveChangesAsync();

            // بهبود شماره ۲: استفاده از عملگر ! برای رفع هشدار null
            await _smsService.SendOtpAsync(user.PhoneNumber!, otpCode);

            return Ok(new { message = "OTP code has been sent to your phone number." });
        }

        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp(VerifyOtpDto verifyOtpDto)
        {
            var normalizedPhoneNumber = NumberUtility.NormalizePhoneNumber(verifyOtpDto.PhoneNumber);
            var normalizedOtpCode = NumberUtility.ConvertToEnglishNumerals(verifyOtpDto.OtpCode);

            var user = await _context.Users.FirstOrDefaultAsync(u => u.PhoneNumber == normalizedPhoneNumber);

            if (user == null || user.OtpCode != normalizedOtpCode || user.OtpExpiration <= DateTime.UtcNow)
            {
                return Unauthorized("Invalid or expired OTP code.");
            }

            user.OtpCode = null;
            user.OtpExpiration = null;
            await _context.SaveChangesAsync();

            var token = _tokenService.CreateToken(user);

            return Ok(new
            {
                message = "Login successful!",
                token = token,
                username = user.UserName
            });
        }
        [HttpPost("register-vendor")]
        public async Task<IActionResult> RegisterVendor(VendorRegisterDto vendorDto)
        {
            var normalizedPhoneNumber = NumberUtility.NormalizePhoneNumber(vendorDto.PhoneNumber);
            if (string.IsNullOrEmpty(normalizedPhoneNumber)) return BadRequest("Invalid phone number.");

            var user = await _userManager.FindByNameAsync(normalizedPhoneNumber);
            if (user != null && await _userManager.IsInRoleAsync(user, "Vendor"))
            {
                return BadRequest("A vendor with this phone number already exists.");
            }

            if (user == null)
            {
                user = new ApplicationUser { /* ... ساخت کاربر جدید مثل قبل ... */ };
                var createUserResult = await _userManager.CreateAsync(user);
                if (!createUserResult.Succeeded) return BadRequest(createUserResult.Errors);
            }

            // ایجاد یا آپدیت پروفایل وندور
            var vendorProfile = await _context.Vendors.FirstOrDefaultAsync(v => v.ApplicationUserId == user.Id);
            if (vendorProfile == null)
            {
                vendorProfile = new Vendor { ApplicationUserId = user.Id };
                _context.Vendors.Add(vendorProfile);
            }

            vendorProfile.StoreName = vendorDto.StoreName;
            vendorProfile.Address = vendorDto.Address;
            vendorProfile.LandlineNumber = vendorDto.LandlineNumber;
            vendorProfile.LogoUrl = vendorDto.LogoUrl;

            // تخصیص نقش وندور
            if (!await _userManager.IsInRoleAsync(user, "Vendor"))
            {
                await _userManager.AddToRoleAsync(user, "Vendor");
            }

            // تولید و ارسال کد OTP
            var otpCode = _random.Next(10000, 99999).ToString();
            user.OtpCode = otpCode;
            user.OtpExpiration = DateTime.UtcNow.AddMinutes(2);

            await _context.SaveChangesAsync();
            await _smsService.SendOtpAsync(user.PhoneNumber!, otpCode);

            return Ok(new { message = "OTP code sent for vendor verification." });
        }
    }
}
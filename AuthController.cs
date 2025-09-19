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
        private static readonly Random _random = new();
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ISmsService _smsService;
        private readonly ITokenService _tokenService;
        // _context را حذف کردیم چون دیگر مستقیماً به آن نیاز نداریم

        public AuthController(UserManager<ApplicationUser> userManager, ISmsService smsService, ITokenService tokenService)
        {
            _userManager = userManager;
            _smsService = smsService;
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

            var user = await _userManager.FindByNameAsync(normalizedPhoneNumber);

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

                // *** تغییر اصلی اینجاست: اختصاص نقش پیش فرض به کاربر جدید ***
                // توجه: مطمئن شوید که نقش "User" در دیتابیس شما وجود دارد
                await _userManager.AddToRoleAsync(user, "User");
            }

            var otpCode = _random.Next(10000, 99999).ToString();
            user.OtpCode = otpCode;
            user.OtpExpiration = DateTime.UtcNow.AddMinutes(2);

            // برای ذخیره تغییرات OTP از UserManager استفاده می کنیم
            await _userManager.UpdateAsync(user);

            await _smsService.SendOtpAsync(user.PhoneNumber!, otpCode);

            return Ok(new { message = "OTP code has been sent to your phone number." });
        }

        // متد VerifyOtp و RegisterVendor بدون تغییر باقی می مانند
        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp(VerifyOtpDto verifyOtpDto)
        {
            var normalizedPhoneNumber = NumberUtility.NormalizePhoneNumber(verifyOtpDto.PhoneNumber);
            var normalizedOtpCode = NumberUtility.ConvertToEnglishNumerals(verifyOtpDto.OtpCode);

            var user = await _userManager.FindByNameAsync(normalizedPhoneNumber);

            if (user == null || user.OtpCode != normalizedOtpCode || user.OtpExpiration <= DateTime.UtcNow)
            {
                return Unauthorized("Invalid or expired OTP code.");
            }

            user.OtpCode = null;
            user.OtpExpiration = null;
            await _userManager.UpdateAsync(user);

            // حالا چون کاربر نقش دارد، توکن به درستی ساخته می شود
            var token = await _tokenService.CreateToken(user);

            return Ok(new
            {
                message = "Login successful!",
                token = token,
                username = user.UserName
            });
        }

        // ... بقیه متدهای کنترلر
    }
}
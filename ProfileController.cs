using Digifair.API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/profile")]
[Authorize] // تمام متدهای این کنترلر نیاز به لاگین دارند
public class ProfileController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;

    public ProfileController(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    [HttpGet("me")] // آدرس: GET /api/profile/me
    public async Task<IActionResult> GetMyProfile()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null) return NotFound();

        // در اینجا می‌توانیم یک DTO برای نمایش پروفایل برگردانیم
        return Ok(new
        {
            user.FirstName,
            user.LastName,
            user.PhoneNumber,
            user.Email,
            user.Address,
            user.Gender,
            user.DateOfBirth
        });
    }

    [HttpPut("me")] // آدرس: PUT /api/profile/me
    public async Task<IActionResult> UpdateMyProfile(UpdateProfileDto profileDto)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null) return NotFound();

        // آپدیت کردن فیلدها
        user.FirstName = profileDto.FirstName ?? user.FirstName;
        user.LastName = profileDto.LastName ?? user.LastName;
        user.Email = profileDto.Email ?? user.Email;
        user.Address = profileDto.Address ?? user.Address;
        user.Gender = profileDto.Gender ?? user.Gender;
        user.DateOfBirth = profileDto.DateOfBirth ?? user.DateOfBirth;

        var result = await _userManager.UpdateAsync(user);

        if (result.Succeeded) return Ok("Profile updated successfully.");
        return BadRequest(result.Errors);
    }
}
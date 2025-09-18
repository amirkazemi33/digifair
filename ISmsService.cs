namespace Digifair.API.Services
{
    public interface ISmsService
    {
        Task SendOtpAsync(string phoneNumber, string otpCode);
    }
}
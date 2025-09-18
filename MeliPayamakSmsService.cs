using System.Net.Http.Json;
using System.Text;
using System.Text.Json;

namespace Digifair.API.Services
{
    public class MeliPayamakSmsService : ISmsService
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<MeliPayamakSmsService> _logger;

        public MeliPayamakSmsService(IConfiguration configuration, IHttpClientFactory httpClientFactory, ILogger<MeliPayamakSmsService> logger)
        {
            _configuration = configuration;
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        public async Task SendOtpAsync(string phoneNumber, string otpCode)
        {
            try
            {
                var username = _configuration["MeliPayamak:Username"];
                var password = _configuration["MeliPayamak:Password"];
                var senderNumber = _configuration["MeliPayamak:SenderNumber"];
                var message = $"کد ورود شما به دیجی‌فیر: {otpCode}";

                // آدرس صحیح و جدید وب سرویس ملی پیامک
                var requestUrl = "https://rest.payamak-panel.com/api/SendSMS/SendSMS";

                var payload = new
                {
                    username = username,
                    password = password,
                    from = senderNumber,
                    to = phoneNumber,
                    text = message,
                    isFlash = false
                };

                var client = _httpClientFactory.CreateClient();

                // تبدیل payload به فرمت JSON
                var jsonPayload = JsonSerializer.Serialize(payload);
                var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

                var response = await client.PostAsync(requestUrl, content);

                if (response.IsSuccessStatusCode)
                {
                    _logger.LogInformation($"OTP '{otpCode}' sent successfully to '{phoneNumber}'.");
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"Failed to send OTP to '{phoneNumber}'. Status: {response.StatusCode}, Response: {errorContent}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"An exception occurred while sending OTP to '{phoneNumber}'.");
            }
        }
    }
}
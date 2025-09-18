using Digifair.API.Entities;
using System.Threading.Tasks; // اضافه کردن این using

namespace Digifair.API.Services
{
    public interface ITokenService
    {
        // متد باید Task<string> برگرداند
        Task<string> CreateToken(ApplicationUser user);
    }
}
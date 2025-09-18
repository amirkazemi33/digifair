using Digifair.API.Entities;
using Microsoft.AspNetCore.Identity;

namespace Digifair.API.Data
{
    public static class DbInitializer
    {
        public static async Task Initialize(IApplicationBuilder app)
        {
            using var scope = app.ApplicationServices.CreateScope();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            if (!await roleManager.RoleExistsAsync("Admin"))
            {
                await roleManager.CreateAsync(new IdentityRole("Admin"));
            }
            if (!await roleManager.RoleExistsAsync("Vendor"))
            {
                await roleManager.CreateAsync(new IdentityRole("Vendor"));
            }
            if (!await roleManager.RoleExistsAsync("Buyer"))
            {
                await roleManager.CreateAsync(new IdentityRole("Buyer"));
            }
        }
    }
}
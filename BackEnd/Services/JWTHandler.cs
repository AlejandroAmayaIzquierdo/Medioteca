using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Models;
using Newtonsoft.Json;
using Util;

namespace Services;

public class JWTHandler(IConfiguration configuration)
{
    private readonly IConfiguration _configuration = configuration;

    public string CreateToken(User user)
    {
        var permissions = user
            .UserRoles.SelectMany(ur => ur.Role?.RolePermissions ?? [])
            .Select(rp => new ClaimPermission(rp.Permission.Id, rp.Permission.Name))
            .Distinct()
            .ToList();

        var roles = user
            .UserRoles.Where(ur => ur.Role != null)
            .Select(ur => new { id = ur.Role!.Id, name = ur.Role.Name })
            .ToList();

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.UserName),
            new(ClaimTypes.Role, JsonConvert.SerializeObject(roles, JsonSettings.Default)),
            new(ClaimTypes.Email, user.Email),
            new("permissions", JsonConvert.SerializeObject(permissions, JsonSettings.Default)),
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration.GetValue<string>("JWTSecurity:Token")!)
        );

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

        var tokenDescriptor = new JwtSecurityToken(
            issuer: _configuration.GetValue<string>("JWTSecurity:Issuer"),
            audience: _configuration.GetValue<string>("JWTSecurity:Audience"),
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(30),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
    }

    public string GenerateRefreshToken()
    {
        var randomNumber = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }
}

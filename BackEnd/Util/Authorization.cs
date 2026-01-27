using Microsoft.AspNetCore.Authorization;
using Models;
using Newtonsoft.Json;
using Util;

public static class AuthorizationUtil
{
    /// <summary>
    /// Configures an authorization policy builder to require specific permissions.
    /// </summary>
    /// <param name="builder">The authorization policy builder.</param>
    /// <param name="requiredPermissions">A collection of required permissions.</param>
    public static void RequirePermissions(
        this AuthorizationPolicyBuilder builder,
        params PermissionTypes[] requiredPermissions
    )
    {
        builder.RequireAssertion(context =>
        {
            // Get the "permissions" claim value
            string userPermissionsString =
                context.User.Claims.FirstOrDefault(claim => claim.Type == "permissions")?.Value
                ?? string.Empty;

            ClaimPermission[] userPermissions =
                JsonConvert.DeserializeObject<ClaimPermission[]>(
                    userPermissionsString,
                    JsonSettings.Default
                ) ?? [];

            if (userPermissions.Length == 0)
                return false;

            // Check if all required permissions are present in the user's permissions
            return requiredPermissions.All(p =>
                userPermissions.Select(up => up.Id).Contains((int)p)
            );
        });
    }
}

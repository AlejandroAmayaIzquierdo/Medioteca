using System.Security.Claims;
using DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services;

namespace Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController(UserService userService) : ControllerBase
{
    private readonly UserService _userService = userService;

    [HttpGet("me")]
    [Authorize]
    public async Task<IResult> GetProfileAsync()
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            return Results.Unauthorized();

        var user = await _userService.GetUserByIdAsync(userId);
        if (user == null)
            return Results.NotFound();

        return Results.Ok(user);
    }

    [HttpPatch("me")]
    [Authorize]
    public async Task<IResult> UpdateProfileAsync([FromBody] UpdateUserProfileDto updateDto)
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            return Results.Unauthorized();

        var updatedUser = await _userService.UpdateUserProfileAsync(userId, updateDto);
        if (updatedUser == null)
            return Results.NotFound();

        return Results.Ok(updatedUser);
    }

    [HttpGet]
    [Authorize(Policy = "AdminAccess")]
    public async Task<IResult> GetAllUsersAsync([FromQuery] UsersQuery query)
    {
        var users = await _userService.GetAllUsersAsync(query);
        return Results.Ok(users);
    }
}

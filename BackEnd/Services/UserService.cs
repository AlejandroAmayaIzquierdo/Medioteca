using System.Linq.Expressions;
using Data;
using DTOs;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Services;

public class UserService(MediotecaDbContext dbContext)
{
    private readonly MediotecaDbContext _dbContext = dbContext;

    public async Task<User?> GetUserByIdAsync(Guid id)
    {
        return await _dbContext
            .Users.Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                    .ThenInclude(rp => rp!.RolePermissions)
                        .ThenInclude(p => p.Permission)
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<PagedList<User>> GetAllUsersAsync(UsersQuery query)
    {
        var usersQuery = _dbContext
            .Users.Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
            .AsQueryable();

        if (!string.IsNullOrEmpty(query.SearchTerm))
        {
            var searchTerm = query.SearchTerm.ToLower();
            usersQuery = usersQuery.Where(u =>
                u.UserName.ToLower().Contains(searchTerm) || u.Email.ToLower().Contains(searchTerm)
            );
        }

        var keySelector = GetSortProperty(query);
        if (query.OrderDir?.ToLower() == "desc")
            usersQuery = usersQuery.OrderByDescending(keySelector);
        else
            usersQuery = usersQuery.OrderBy(keySelector);

        return await PagedList<User>.CreateAsync(usersQuery, query.PageNumber, query.PageSize);
    }

    public async Task<User?> UpdateUserProfileAsync(Guid userId, UpdateUserProfileDto updateDto)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
            return null;

        if (!string.IsNullOrEmpty(updateDto.UserName))
            user.UserName = updateDto.UserName;

        if (updateDto.IsActive.HasValue)
            user.IsActive = updateDto.IsActive.Value;

        await _dbContext.SaveChangesAsync();
        return user;
    }

    public async Task<bool> DeactivateUserAsync(Guid userId)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
            return false;

        user.IsActive = !user.IsActive;
        await _dbContext.SaveChangesAsync();
        return true;
    }

    private static Expression<Func<User, object>> GetSortProperty(UsersQuery query)
    {
        return query.OrderBy?.ToLower() switch
        {
            "id" => destination => destination.Id,
            "name" => destination => destination.UserName!,
            "email" => destination => destination.Email!,
            _ => destination => destination.UserName!,
        };
    }
}

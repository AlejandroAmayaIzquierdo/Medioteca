using Data;
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
            .ThenInclude(rp => rp.RolePermissions)
            .ThenInclude(p => p.Permission)
            .FirstOrDefaultAsync(u => u.Id == id);
    }
}

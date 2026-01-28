using Microsoft.EntityFrameworkCore;
using Models;

namespace Data;

public class MediotecaDbContext(DbContextOptions options) : DbContext(options)
{
    // Auth
    public DbSet<User> Users { get; set; }
    public DbSet<Session> Sessions { get; set; }

    public DbSet<Device> Devices { get; set; }

    // Roles
    public DbSet<Role> Roles { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }
    public DbSet<RolePermission> RolePermissions { get; set; }
    public DbSet<Permission> Permissions { get; set; }

    // Media
    public DbSet<Media> Media { get; set; }
    public DbSet<MediaType> MediaTypes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Roles
        modelBuilder
            .Entity<Role>()
            .HasData(
                new Role
                {
                    Id = (int)RoleTypes.Admin,
                    Name = "Admin",
                    Description = "Administrator role with full access",
                    Active = true,
                },
                new Role
                {
                    Id = (int)RoleTypes.User,
                    Name = "User",
                    Description = "Regular user that can view and create media",
                    Active = true,
                }
            );

        // Permissions
        modelBuilder
            .Entity<Permission>()
            .HasData(
                new Permission { Id = (int)PermissionTypes.AdminAccess, Name = "AdminAccess" },
                new Permission { Id = (int)PermissionTypes.UserAccess, Name = "UserAccess" },
                new Permission { Id = (int)PermissionTypes.ManageUsers, Name = "ManageUsers" },
                new Permission { Id = (int)PermissionTypes.CanCreateMedia, Name = "CanCreateMedia" }
            );

        // Relation between Roles and Permissions
        modelBuilder
            .Entity<RolePermission>()
            .HasData(
                // Admin (full)
                new RolePermission
                {
                    Id = 1,
                    RoleId = (int)RoleTypes.Admin,
                    PermissionId = (int)PermissionTypes.AdminAccess,
                },
                new RolePermission
                {
                    Id = 2,
                    RoleId = (int)RoleTypes.Admin,
                    PermissionId = (int)PermissionTypes.UserAccess,
                },
                new RolePermission
                {
                    Id = 3,
                    RoleId = (int)RoleTypes.Admin,
                    PermissionId = (int)PermissionTypes.ManageUsers,
                },
                new RolePermission
                {
                    Id = 5,
                    RoleId = (int)RoleTypes.Admin,
                    PermissionId = (int)PermissionTypes.CanCreateMedia,
                },
                // User (básico)
                new RolePermission
                {
                    Id = 6,
                    RoleId = (int)RoleTypes.User,
                    PermissionId = (int)PermissionTypes.UserAccess,
                },
                new RolePermission
                {
                    Id = 7,
                    RoleId = (int)RoleTypes.User,
                    PermissionId = (int)PermissionTypes.CanCreateMedia,
                }
            );

        // Create an admin user

        const string adminUserId = "11111111-1111-1111-1111-111111111111";
        const string AdminPasswordHash =
            "$argon2id$v=19$m=65536,t=3,p=1$YJWOX/HegOyik3549zUWxw$Xr+95M2c54e3QnfdrYtD+R2KtD+R4GBOtFeLVnX2Xno";

        modelBuilder
            .Entity<User>()
            .HasData(
                new User
                {
                    Id = Guid.Parse(adminUserId),
                    UserName = "admin",
                    Email = "admin@gmail.com",
                    PasswordHash = AdminPasswordHash,
                }
            );

        modelBuilder
            .Entity<UserRole>()
            .HasData(
                new UserRole
                {
                    Id = -1,
                    UserId = Guid.Parse(adminUserId),
                    RoleId = (int)RoleTypes.Admin,
                }
            );

        // Media Types

        modelBuilder
            .Entity<MediaType>()
            .HasData(
                new MediaType { Id = 1, Name = "Video", },
                new MediaType { Id = 2, Name = "Audio", },
                new MediaType { Id = 3, Name = "Image", },
                new MediaType { Id = 4, Name = "Document", }
            );
    }
}

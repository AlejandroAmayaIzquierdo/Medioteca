using System.Text.Json.Serialization;

namespace Models;

public class User
{
    public Guid Id { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }

    [JsonIgnore]
    public string PasswordHash { get; set; } = string.Empty;

    [JsonIgnore]
    public Guid? ProfilePicId { get; set; } = null;

    [JsonIgnore]
    public string? ProfilePicLink { get; set; } = null;

    public virtual ICollection<UserRole> UserRoles { get; set; } = [];
}

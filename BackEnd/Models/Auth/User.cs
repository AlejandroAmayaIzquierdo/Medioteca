using System.Text.Json.Serialization;

namespace Models;

public class User
{
    public Guid Id { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    [JsonIgnore]
    public string PasswordHash { get; set; } = string.Empty;

    public Guid? ProfilePicId { get; set; } = null;
    public string? ProfilePicLink { get; set; } = null;

    public virtual ICollection<UserRole> UserRoles { get; set; } = [];
}

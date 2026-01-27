using System.Text.Json.Serialization;

namespace Models;

public class UserRole
{
    public int Id { get; set; }

    [JsonIgnore]
    public Guid UserId { get; set; }
    public int RoleId { get; set; }

    public virtual Role? Role { get; set; }

    [JsonIgnore]
    public virtual User? User { get; set; }
}

namespace Models;

public class Media
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public required int MediaTypeId { get; set; }

    public virtual MediaType? MediaType { get; set; }
}

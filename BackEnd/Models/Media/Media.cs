namespace Models;

public class Media
{
    public required int Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public string? Url { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public required MediaType MediaType { get; set; }
}

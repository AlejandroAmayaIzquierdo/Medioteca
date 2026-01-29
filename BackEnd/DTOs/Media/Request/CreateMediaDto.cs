namespace DTOs;

public class CreateMediaDto
{
    public required string Title { get; set; }
    public string? Description { get; set; }
    public required int MediaTypeId { get; set; }
}

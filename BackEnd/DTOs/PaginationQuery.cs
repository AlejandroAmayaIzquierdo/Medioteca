namespace DTOs;

public class PaginationQuery
{
    public string? SearchTerm { get; set; } = null;
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;

    public string? OrderBy { get; set; } = "id";

    public string? OrderDir { get; set; } = "asc";
}

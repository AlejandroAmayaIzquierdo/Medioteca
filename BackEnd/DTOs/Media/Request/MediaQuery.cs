using Models;

namespace DTOs;

public class MediaQuery : PaginationQuery
{
    public int? MediaType { get; set; }
}

using Microsoft.EntityFrameworkCore;

namespace DTOs;

public class PagedList<T>
{
    const int DEFAULT_PAGE_SIZE = 20;

    private PagedList(List<T> items, int page, int pageSize, int totalCount)
    {
        Items = items;
        Page = page;
        PageSize = pageSize;
        TotalCount = totalCount;
    }

    public List<T> Items { get; } = [];
    public int Page { get; }
    public int PageSize { get; }
    public int TotalCount { get; }

    public bool HasNextPage => Page * PageSize < TotalCount;
    public bool HasPreviousPage => Page > 1;

    public static async Task<PagedList<T>> CreateAsync(IQueryable<T> query, int page, int pageSize)
    {
        int currentPage = Math.Abs(page);
        int currentSize = Math.Abs(pageSize);

        if (currentSize == 0)
            currentSize = DEFAULT_PAGE_SIZE;
        else if (currentSize > DEFAULT_PAGE_SIZE)
            currentSize = DEFAULT_PAGE_SIZE;

        int totalCount = await query.CountAsync();
        List<T> items = await query
            .Skip((currentPage - 1) * currentSize)
            .Take(currentSize)
            .ToListAsync();

        return new PagedList<T>(items, currentPage, currentSize, totalCount);
    }
}

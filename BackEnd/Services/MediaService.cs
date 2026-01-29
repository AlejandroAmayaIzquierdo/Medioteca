using System.Linq.Expressions;
using Data;
using DTOs;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Errors;

namespace Services;

public class MediaService(MediotecaDbContext dbContext)
{
    private readonly MediotecaDbContext _dbContext = dbContext;

    public async Task<PagedList<Media>> GetMediaAsync(MediaQuery query)
    {
        var mediaQuery = _dbContext.Media.Include(m => m.MediaType).AsQueryable();

        if (query.SearchTerm is not null)
        {
            mediaQuery = mediaQuery.Where(m =>
                m.Title.Contains(query.SearchTerm)
                || (m.Description != null && m.Description.Contains(query.SearchTerm))
            );
        }

        if (query.MediaType is not null)
            mediaQuery = mediaQuery.Where(m => m.MediaTypeId == query.MediaType);

        var keySelector = GetSortProperty(query);
        if (query.OrderDir?.ToLower() == "desc")
            mediaQuery = mediaQuery.OrderByDescending(keySelector);
        else
            mediaQuery = mediaQuery.OrderBy(keySelector);

        return await PagedList<Media>.CreateAsync(mediaQuery, query.PageNumber, query.PageSize);
    }

    public async Task<PagedList<MediaType>> GetMediaTypes()
    {
        var mediaTypes = await _dbContext.MediaTypes.ToListAsync();

        return PagedList<MediaType>.Create(mediaTypes, 1, mediaTypes.Count, mediaTypes.Count);
    }

    public async Task<PagedList<Media>> GetMediaByTypesAsync(int id)
    {
        return await GetMediaAsync(new MediaQuery { MediaType = id });
    }

    public async Task<Result<Media>> CreateMediaAsync(CreateMediaDto newMedia)
    {
        if (!await MediaTypeExists(newMedia.MediaTypeId))
            return Result<Media>.Failure(MediaErrors.MediaTypeNotFound);

        if (await IsTittleTaken(newMedia.Title))
            return Result<Media>.Failure(MediaErrors.TitleTaken);

        int nextId = await GetNextMediaId();

        var media = new Media
        {
            Id = nextId,
            Title = newMedia.Title,
            Description = newMedia.Description,
            MediaTypeId = newMedia.MediaTypeId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        _dbContext.Media.Add(media);
        await _dbContext.SaveChangesAsync();

        return Result<Media>.Success(media);
    }

    private async Task<bool> MediaTypeExists(int mediaTypeId)
    {
        return await _dbContext.MediaTypes.AnyAsync(mt => mt.Id == mediaTypeId);
    }

    private async Task<bool> IsTittleTaken(string title)
    {
        return await _dbContext.Media.AnyAsync(m => m.Title == title);
    }

    private async Task<int> GetNextMediaId()
    {
        var lastMedia = await _dbContext
            .Media.AsNoTracking()
            .OrderByDescending(m => m.Id)
            .FirstOrDefaultAsync();
        return (lastMedia?.Id ?? 0) + 1;
    }

    private static Expression<Func<Media, object>> GetSortProperty(MediaQuery query)
    {
        return query.OrderBy?.ToLower() switch
        {
            "id" => destination => destination.Id,
            "title" => destination => destination.Title,
            "mediatype" => destination => destination.MediaType,
            "description" => destination => destination.Description!,
            "createdat" => destination => destination.CreatedAt,
            "updatedat" => destination => destination.UpdatedAt,
            _ => destination => destination.CreatedAt,
        };
    }
}

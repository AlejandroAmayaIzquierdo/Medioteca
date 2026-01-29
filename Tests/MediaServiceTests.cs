using Data;
using DTOs;
using Microsoft.EntityFrameworkCore;
using Models;
using Services;

namespace Medioteca.Tests;

public class MediaServiceTests
{
    private static MediotecaDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<MediotecaDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new MediotecaDbContext(options);
    }

    [Fact]
    public async Task CreateMediaAsync_ShouldAddMedia()
    {
        var dbContext = CreateDbContext();
        var mediaService = new MediaService(dbContext);

        dbContext.MediaTypes.Add(new MediaType { Id = 1, Name = "Video" });
        await dbContext.SaveChangesAsync();

        var media = new CreateMediaDto
        {
            Title = "Test Media",
            Description = "This is a test media item.",
            MediaTypeId = 1
        };
        Result<Media> result = await mediaService.CreateMediaAsync(media);
        Media? createdMedia = result.Value;

        Assert.True(result.IsSuccess);
        Assert.NotNull(createdMedia);
        Assert.Equal("Test Media", createdMedia.Title);
        Assert.Equal("This is a test media item.", createdMedia.Description);
        Assert.Equal(1, createdMedia.MediaTypeId);
    }

    [Fact]
    public async Task CreateMediaAsync_ShouldReturnError_WhenMediaTypeDoesNotExist()
    {
        var dbContext = CreateDbContext();
        var mediaService = new MediaService(dbContext);

        var media = new CreateMediaDto
        {
            Title = "Test Media",
            Description = "This is a test media item.",
            MediaTypeId = 999 // Non-existing MediaTypeId
        };
        Result<Media> result = await mediaService.CreateMediaAsync(media);

        Assert.False(result.IsSuccess);
        Assert.NotNull(result.Error);
        Assert.Equal("MediaTypeNotFound", result.Error.Code);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    public async Task CreateMediaAsync_ShouldReturnError_InvalidTittle(string? invalidTitle)
    {
        var dbContext = CreateDbContext();
        var mediaService = new MediaService(dbContext);

        var media = new CreateMediaDto
        {
            Title = invalidTitle!,
            Description = "This is a test media item.",
            MediaTypeId = 1
        };
        Result<Media> result = await mediaService.CreateMediaAsync(media);

        Assert.False(result.IsSuccess);
        Assert.NotNull(result.Error);
        Assert.Equal("InvalidTitle", result.Error.Code);
    }

    [Theory]
    [InlineData("Harry Potter", 1)]
    [InlineData("Tierra Media", 2)]
    public async Task GetMediaAsync_ShouldReturnFilterMedia(string filter, int expectedMediaId)
    {
        var dbContext = CreateDbContext();
        var mediaService = new MediaService(dbContext);

        // Agregar el MediaType necesario para la relación
        dbContext.MediaTypes.Add(new MediaType { Id = 1, Name = "Video" });
        await dbContext.SaveChangesAsync();

        var media1 = new Media
        {
            Id = 1,
            Title = "Harry Potter y la Piedra Filosofal",
            Description = "Primera entrega de la saga",
            MediaTypeId = 1
        };
        var media2 = new Media
        {
            Id = 2,
            Title = "El Señor de los Anillos",
            Description = "Una épica aventura en la Tierra Media",
            MediaTypeId = 1
        };
        dbContext.Media.AddRange(media1, media2);
        await dbContext.SaveChangesAsync();

        Console.WriteLine("Database seeded with test media items.");
        Console.WriteLine(dbContext.Media.Count() + " media items in database.");

        // Act
        var result = await mediaService.GetMediaAsync(new MediaQuery { SearchTerm = filter, });

        List<Media> resultMedias = result.Items;

        Assert.NotNull(resultMedias);
        Assert.Single(resultMedias);

        var foundMedia = resultMedias.First();
        Assert.Equal(expectedMediaId, foundMedia.Id);
    }
}

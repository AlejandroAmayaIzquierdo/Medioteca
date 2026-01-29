using DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services;

namespace Controllers;

[ApiController]
[Route("api/[controller]")]
public class MediaController(MediaService mediaService) : ControllerBase
{
    private readonly MediaService _mediaService = mediaService;

    [HttpGet]
    public async Task<IResult> GetMediaAsync([FromQuery] MediaQuery query)
    {
        var media = await _mediaService.GetMediaAsync(query);
        return Results.Ok(media);
    }

    [HttpGet("{id:int}")]
    public async Task<IResult> GetMediaByIdAsync(int id)
    {
        var media = await _mediaService.GetMediaByIdAsync(id);
        return Results.Ok(media);
    }

    [HttpGet("types")]
    public async Task<IResult> GetMediaTypesAsync()
    {
        var mediaTypes = await _mediaService.GetMediaTypes();
        return Results.Ok(mediaTypes);
    }

    [HttpGet("types/{id:int}")]
    public async Task<IResult> GetMediaByTypesAsync(int id)
    {
        var media = await _mediaService.GetMediaByTypesAsync(id);
        return Results.Ok(media);
    }

    [HttpPost]
    [Authorize(Policy = "UserAccess")]
    public async Task<IResult> CreateMediaAsync([FromBody] CreateMediaDto newMedia)
    {
        var result = await _mediaService.CreateMediaAsync(newMedia);

        if (result.IsSuccess && result.Value is not null)
            return Results.Ok(result.Value);

        return Results.Problem(
            result.Error!.Description,
            title: "Error al crear la obra",
            statusCode: 400
        );
    }
}

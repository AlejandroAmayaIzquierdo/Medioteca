namespace Models.Errors;

public static class MediaErrors
{
    public static Error MediaTypeNotFound =>
        new("MediaTypeNotFound", "The specified media type does not exist.");

    public static Error TitleTaken => new("TitleTaken", "The media title is already taken.");
}

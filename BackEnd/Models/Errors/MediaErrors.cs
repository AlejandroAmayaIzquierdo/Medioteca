namespace Models.Errors;

public static class MediaErrors
{
    public static Error MediaTypeNotFound =>
        new("MediaTypeNotFound", "El tipo de obra no fue encontrado");

    public static Error TitleTaken => new("TitleTaken", "El título de la obra ya está en uso.");

    public static Error InvalidTitle =>
        new("InvalidTitle", "El título de la obra no puede estar vacío.");
}

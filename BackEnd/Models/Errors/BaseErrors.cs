namespace Models.Errors;

public static class BaseErrors
{
    public static Error RegistrationFailed =>
        new("RegistrationFailed", "El registro del usuario ha fallado");
}

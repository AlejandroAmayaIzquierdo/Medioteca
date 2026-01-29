namespace Models.Errors;

public static class AuthErrors
{
    public static Error EmailTaken => new("EmailTaken", "El email ya está en uso");
    public static Error InvalidEmail => new("InvalidEmail", "El formato del email es inválido");
    public static Error InvalidPassword =>
        new("InvalidPassword", "La contraseña debe tener al menos 8 caracteres");

    public static Error InvalidCredentials =>
        new("InvalidCredentials", "El usuario o la contraseña son incorrectos");

    public static Error DeactivatedAccount =>
        new("DeactivatedAccount", "La cuenta ha sido desactivada. Contacta al administrador.");
}

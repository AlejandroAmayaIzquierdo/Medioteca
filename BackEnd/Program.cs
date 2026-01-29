using System.Text;
using Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpLogging;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Middlewares;
using Models;
using Scalar.AspNetCore;
using Services;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddConsole();

builder.Services.AddHttpLogging(logging =>
{
    logging.LoggingFields =
        HttpLoggingFields.RequestPath
        | HttpLoggingFields.RequestQuery
        | HttpLoggingFields.RequestMethod
        | HttpLoggingFields.ResponseStatusCode;
    logging.CombineLogs = true;
    logging.RequestHeaders.Clear();
    logging.ResponseHeaders.Clear();
});

builder.Services.AddOpenApi();

builder.Services.AddDbContext<MediotecaDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("Local"))
);

builder
    .Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter()
        );
    });

builder
    .Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JWTSecurity:Issuer"],
            ValidAudience = builder.Configuration["JWTSecurity:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["JWTSecurity:Token"]!)
            ),
            ClockSkew = TimeSpan.Zero, // XXX Ony for testing
        };
    });

builder
    .Services.AddAuthorizationBuilder()
    .AddPolicy("UserAccess", policy => policy.RequirePermissions(PermissionTypes.UserAccess))
    .AddPolicy("AdminAccess", policy => policy.RequirePermissions(PermissionTypes.AdminAccess))
    .AddPolicy(
        "MangeUsers",
        policy =>
            policy.RequirePermissions(PermissionTypes.AdminAccess, PermissionTypes.ManageUsers)
    );

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "FrontEnd",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:4200", "http://localhost:3000")
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
    );
});

builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<JWTHandler>();
builder.Services.AddScoped<DeviceService>();
builder.Services.AddScoped<MediaService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapScalarApiReference();
    app.MapOpenApi();
}

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    var context = services.GetRequiredService<MediotecaDbContext>();
    if (context.Database.GetPendingMigrations().Any())
    {
        context.Database.Migrate();
    }
}

app.UseCors("FrontEnd");
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<GlobalExceptionHandlerMiddleware>();

app.MapControllers();

app.Run();

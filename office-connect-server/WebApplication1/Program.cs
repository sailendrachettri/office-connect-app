using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using OfficeConnectServer.Data;
using OfficeConnectServer.Helpers;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.StaticFiles;


var builder = WebApplication.CreateBuilder(args);
builder.Host.UseWindowsService();
builder.Services.AddSignalR();
builder.Services.AddScoped<MessageRepository>();
builder.Services.AddScoped<DbConnectionFactory>();
builder.Services.AddScoped<DbHelper>();
builder.Services.AddScoped<FileRepository>();



builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],

            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)
            ),

            ClockSkew = TimeSpan.Zero
        };

        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = context =>
            {
                var userIdClaim = context.Principal?
                    .Claims.FirstOrDefault(c =>
                        c.Type == JwtRegisteredClaimNames.Sub ||
                        c.Type == ClaimTypes.NameIdentifier
                    );

                if (userIdClaim == null)
                {
                    context.Fail("UserId claim missing");
                    return Task.CompletedTask;
                }

                // Store UserId for controllers
                context.HttpContext.Items["UserId"] =
                    Guid.Parse(userIdClaim.Value);

                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddScoped<JwtTokenHelper>();
builder.Services.AddSingleton<JwtTokenHelper>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowViteDevServer", policy =>
    {
        policy
            //.WithOrigins("http://localhost:5173") 
            .AllowAnyHeader()
            .SetIsOriginAllowed(_ => true)
            .AllowAnyMethod()
            .AllowCredentials();
    });
});


// Configure Kestrel BEFORE Build()
builder.WebHost.ConfigureKestrel(options =>
{
    // HTTP
    options.ListenAnyIP(5171);

    // HTTPS (requires dev certificate installed)
    //options.ListenAnyIP(t171, listen =>
    //{
    //    listen.UseHttps();
    //});
});


// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Logging.ClearProviders();
builder.Logging.AddConsole();


var app = builder.Build();

app.UseStaticFiles();


// Electron auto-updates
var updatesPath = @"C:\OfficeConnectRelease";
var provider = new FileExtensionContentTypeProvider();
provider.Mappings[".yml"] = "application/octet-stream"; // ensure .yml is served

if (!Directory.Exists(updatesPath))
    Directory.CreateDirectory(updatesPath);

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(updatesPath),
    RequestPath = "/updates",
    ContentTypeProvider = provider
});

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(builder.Environment.ContentRootPath, "Uploads")),
    RequestPath = "/uploads"
});



app.MapGet("/updates-check", () =>
{
    return Directory.GetFiles(@"C:\OfficeConnectRelease");
});


app.MapGet("/debug-updates", () =>
{
    var path = @"C:\OfficeConnectRelease\latest.yml";
    return new
    {
        Exists = System.IO.File.Exists(path),
        Files = Directory.Exists(@"C:\OfficeConnectRelease")
            ? Directory.GetFiles(@"C:\OfficeConnectRelease")
            : Array.Empty<string>()
    };
});


app.UseCors("AllowViteDevServer");


// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHub<ChatHub>("/hubs/chat");

app.Run();

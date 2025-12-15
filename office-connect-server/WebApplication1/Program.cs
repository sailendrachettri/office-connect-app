using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.IdentityModel.Tokens;
using OfficeConnectServer.Data;
using OfficeConnectServer.Helpers;
using System.Security.Claims;
using System.Text;
using System.IdentityModel.Tokens.Jwt;

var builder = WebApplication.CreateBuilder(args);
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
            .WithOrigins("http://localhost:5173") 
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


// Configure Kestrel BEFORE Build()
builder.WebHost.ConfigureKestrel(options =>
{
    // HTTP
    options.ListenAnyIP(5030);

    // HTTPS (requires dev certificate installed)
    options.ListenAnyIP(7171, listen =>
    {
        listen.UseHttps();
    });
});

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<DbConnectionFactory>();
builder.Services.AddScoped<DbHelper>();

var app = builder.Build();

app.UseCors("AllowViteDevServer");

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

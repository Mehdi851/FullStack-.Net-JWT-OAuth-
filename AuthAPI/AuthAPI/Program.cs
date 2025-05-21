using AuthAPI.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//db context services
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});
// Configur the JWT token 
builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey =new SymmetricSecurityKey(Encoding.UTF8.GetBytes("4D6A7F2E5C8B3A9D1E0F4G7H2J5K8L3M9N1P0Q2R4S6T8U0V1W3X5Y7Z9")),
        ValidateAudience =false,
        ValidateIssuer =false,
    };
});

//enable cors
builder.Services.AddCors(option =>
{
    option.AddPolicy("MyPolicy", builder =>
    {
        builder.AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
    });
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("MyPolicy");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

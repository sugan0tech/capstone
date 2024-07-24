using System.Text;
using DonationService.Commons;
using DonationService.Commons.Enums;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using WatchDog;

namespace DonationService;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.

        builder.Services.AddControllers();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddLogging(l => l.AddLog4Net());
        builder.Services.AddSwaggerGen(option =>
        {
            option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
            {
                Name = "Authorization",
                Type = SecuritySchemeType.ApiKey,
                Scheme = "Bearer",
                BearerFormat = "JWT",
                In = ParameterLocation.Header,
                Description =
                    "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer 1safsfsdfdfd\""
            });
            option.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    new string[] { }
                }
            });
        }); // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
        builder.Services.AddHttpContextAccessor();
        #region Context

        builder.Services.AddDbContext<DonationServiceContext>(optionsBuilder =>
            {
                optionsBuilder.UseSqlServer(builder.Configuration.GetConnectionString("defaultConnection"));
                optionsBuilder.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
            }
        );

        #endregion
        #region Logger

        builder.Services.AddLogging(l => l.AddLog4Net());
        builder.Services.AddWatchDogServices(opt =>
        {
            opt.SetExternalDbConnString = builder.Configuration.GetConnectionString("eventStore");
            opt.DbDriverOption = WatchDog.src.Enums.WatchDogDbDriverEnum.MSSQL;
        });

        #endregion

        #region AuthConfig

        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateIssuerSigningKey = true,
                    ValidateLifetime = true,
                    IssuerSigningKey =
                        new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["TokenKey:JWT"]))
                };
            });
        builder.Services.AddAuthorization(options =>
        {
            options.AddPolicy("CenterAdmin", policyBuilder => policyBuilder.RequireRole(Role.CenterAdmin.ToString()));
            options.AddPolicy("HospitalAdmin", policyBuilder => policyBuilder.RequireRole(Role.HospitalAdmin.ToString()));
            options.AddPolicy("PharmaAdmin", policyBuilder => policyBuilder.RequireRole(Role.PharmaAdmin.ToString()));
            options.AddPolicy("AdminPolicy", policyBuilder => policyBuilder.RequireRole(Role.PharmaAdmin.ToString()));
            options.AddPolicy("Donor",
                policyBuilder => policyBuilder.RequireRole(Role.Donor.ToString()));
        });

        #endregion

        #region Cors

        builder.Services.AddCors(opts =>
        {
            opts.AddPolicy("AllowAll",
                corsPolicyBuilder => { corsPolicyBuilder.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin(); });
        });

        #endregion

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseAuthorization();
        app.UseAuthentication();
        app.UseWatchDogExceptionLogger();
        
        var watchdogCredentials = builder.Configuration.GetSection("WatchDog");
        app.UseWatchDog(opt =>
        {
            opt.WatchPageUsername = watchdogCredentials["username"];
            opt.WatchPagePassword = watchdogCredentials["password"];
        });

        app.MapControllers();

        app.Run();
    }
}
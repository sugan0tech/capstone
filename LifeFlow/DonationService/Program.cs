using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Amazon;
using Amazon.SecretsManager;
using Amazon.SecretsManager.Model;
using DonationService.Auth;
using DonationService.Commons;
using DonationService.Commons.Enums;
using DonationService.Commons.Services;
using DonationService.Commons.Validations;
using DonationService.Entities;
using DonationService.Features.Address;
using DonationService.Features.Address.Command;
using DonationService.Features.Address.Query;
using DonationService.Features.BloodCenter;
using DonationService.Features.Client;
using DonationService.Features.DonationSlot;
using DonationService.Features.Donor;
using DonationService.Features.GeoCoding;
using DonationService.Features.Notification;
using DonationService.Features.Orders;
using DonationService.Features.Orders.Commands;
using DonationService.Features.Payment;
using DonationService.Features.UnitBag;
using DonationService.Features.User;
using DonationService.Features.UserSession;
using DonationService.Jobs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Quartz;

namespace DonationService;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.

        builder.Services.AddControllers().AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        });
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddLogging(l => l.AddLog4Net());
        builder.Services.AddSwaggerGen(option =>
        {
            option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
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

        // AWS Secrets Manager integration
        string secretName = "LifeFlowSecrets";
        string region = "us-east-1";

        IAmazonSecretsManager client = new AmazonSecretsManagerClient(RegionEndpoint.GetBySystemName(region));

        GetSecretValueRequest request = new GetSecretValueRequest
        {
            SecretId = secretName,
            VersionStage = "AWSCURRENT",
        };

        GetSecretValueResponse response;
        try
        {
            response = client.GetSecretValueAsync(request).Result;
        }
        catch (Exception e)
        {
            throw e;
        }

        string secret = response.SecretString;

        // Parse the secret JSON
        var secretData = JsonSerializer.Deserialize<Dictionary<string, string>>(secret);

        string mainDbConnectionString = secretData["LifeFlowDbConnectionString"];
        string eventDbConnectionString = secretData["EventDbConnectionString"];
        string tokenKey = secretData["TokenKey"];

        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
        builder.Services.AddHttpContextAccessor();

        #region Context

        builder.Services.AddDbContext<DonationServiceContext>(optionsBuilder =>
            {
                optionsBuilder.UseSqlServer(mainDbConnectionString);
                optionsBuilder.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
            }
        );

        #endregion

        #region Logger

        builder.Services.AddLogging(l => l.AddLog4Net());
        // builder.Services.AddWatchDogServices(opt =>
        // {
        //     opt.SetExternalDbConnString = eventDbConnectionString;
        //     opt.DbDriverOption = WatchDogDbDriverEnum.MSSQL;
        // });

        #endregion


        #region repos

        builder.Services.AddScoped<IBaseRepo<Address>, AddressRepo>();
        builder.Services.AddScoped<IBaseRepo<User>, UserRepo>();
        builder.Services.AddScoped<IBaseRepo<UserSession>, UserSessionRepo>();
        builder.Services.AddScoped<IBaseRepo<Donor>, DonorRepo>();
        builder.Services.AddScoped<IBaseRepo<BloodCenter>, BloodCenterRepo>();
        builder.Services.AddScoped<IBaseRepo<DonationSlot>, DonationSlotRepo>();
        builder.Services.AddScoped<IBaseRepo<UnitBag>, UnitBagRepo>();

        builder.Services.AddScoped<IBaseRepo<Client>, ClientRepo>();
        builder.Services.AddScoped<IBaseRepo<Order>, OrderRepo>();
        builder.Services.AddScoped<IBaseRepo<Payment>, PaymentRepo>();
        builder.Services.AddScoped<IBaseRepo<Notification>, NotificationRepo>();

        #endregion

        #region services

        builder.Services.AddScoped<IUserService, UserService>();
        builder.Services.AddScoped<IDonorService, DonorService>();
        builder.Services.AddScoped<IUserSessionService, UserSessionService>();
        builder.Services.AddScoped<IAuthService, AuthService>();
        builder.Services.AddScoped<ITokenService, TokenService>();
        builder.Services.AddScoped<ITokenService, TokenService>();
        builder.Services.AddScoped<UnitBagService>();
        builder.Services.AddScoped<DonationSlotService>();
        builder.Services.AddScoped<PaymentService>();
        builder.Services.AddScoped<BloodCenterService>();
        builder.Services.AddScoped<GeocodingService>();
        builder.Services.AddScoped<NotificationService>();

        // Commands and queries 
        builder.Services.AddMediatR(options => { options.RegisterServicesFromAssemblies(typeof(Program).Assembly); });
        builder.Services.AddScoped<IAddressCommandHandler<CreateAddressCommand>, CreateAddressAddressCommandHandler>();
        builder.Services.AddScoped<IAddressCommandHandler<UpdateAddressCommand>, UpdateAddressAddressCommandHandler>();
        builder.Services.AddScoped<IAddressCommandHandler<DeleteAddressCommand>, DeleteAddressAddressCommandHandler>();
        builder.Services.AddScoped<IQueryHandler<GetAddressByIdQuery, AddressDto>, GetAddressByIdQueryHandler>();
        builder.Services
            .AddScoped<IQueryHandler<GetAllAddressesQuery, List<AddressDto>>, GetAllAddressesQueryHandler>();
        builder.Services.AddScoped<CustomControllerValidator>();
        builder.Services.AddScoped<IOrderCommandHandler<UpdateOrderStatusCommand>, UpdateOrderCommandHandler>();

        // OrderServices
        builder.Services.AddScoped<OrderService>();
        builder.Services.AddScoped<PaymentService>();
        builder.Services.AddScoped<ClientService>();

        // todo to migrate to new service
        builder.Services.AddScoped<OtpService>();
        builder.Services.AddScoped<EmailService>();

        builder.Services.AddHttpClient<GeocodingService>();


        // SignalR
        builder.Services.AddSignalR();
        builder.Services.AddAuthorization(options =>
        {
            options.AddPolicy("NotificationPolicy", policy => { policy.RequireAuthenticatedUser(); });
        });

        #endregion

        #region Jobs

        builder.Services.AddQuartz(q =>
        {
            q.UseMicrosoftDependencyInjectionJobFactory();
            // q.UsePersistentStore(s =>
            // {
            //     s.UseSqlServer(builder.Configuration.GetConnectionString("defaultConnection"));
            // });

            q.AddJob<CheckExpiryJob>(opts => opts.WithIdentity("CheckExpiryJob"));
            q.AddTrigger(opts => opts.ForJob("CheckExpiryJob")
                .WithIdentity("CheckExpiryJob-trigger")
                // .WithCronSchedule("0 0 * * * ?"));
                .WithCronSchedule("0 0 6 * * ?"));

            q.AddJob<EarlyExpiryNotificationJob>(opts => opts.WithIdentity("EarlyExpiryNotificationJob"));
            q.AddTrigger(opts => opts
                .ForJob("EarlyExpiryNotificationJob")
                .WithIdentity("EarlyExpiryNotificationJob-trigger")
                // .WithCronSchedule("0 0 * * * ?"));
                .WithCronSchedule("0 0 6 * * ?"));

            // If slot reaches time
            q.AddJob<SlotNotificationJob>(opts => opts.WithIdentity("SlotNotificationJob"));
            q.AddTrigger(opts => opts
                .ForJob("SlotNotificationJob")
                .WithIdentity("SlotNotificationJob-trigger")
                .WithCronSchedule("0 0/30 * * * ?"));

            // If send notification, if donor can donate blood
            q.AddJob<SlotNotificationJob>(opts => opts.WithIdentity("DonationRequestJob"));
            q.AddTrigger(opts => opts
                .ForJob("DonationRequestJob")
                .WithIdentity("DonationRequestJob-trigger")
                // .WithCronSchedule("0 0 * * * ?"));
                .WithCronSchedule("0 0 8 1 * ?"));

            q.AddJob<OrderPaymentNotifyJob>(opts => opts.WithIdentity("OrderPaymentNotifyJob"));
            q.AddTrigger(opts => opts
                .ForJob("OrderPaymentNotifyJob")
                .WithIdentity("OrderPaymentNotifyJob-trigger")
                // .WithCronSchedule("0 0 * * * ?"));
                .WithCronSchedule("0 0 8 * * ?")); // works for every day 8 am

            q.AddJob<OrderDeliveredNotifyJob>(opts => opts.WithIdentity("OrderDeliveredNotifyJob"));
            q.AddTrigger(opts => opts
                .ForJob("OrderDeliveredNotifyJob")
                .WithIdentity("OrderDeliveredNotifyJob-trigger")
                // .WithCronSchedule("0 0 * * * ?"));
                .WithCronSchedule("0 0 8 * * ?")); // works for every day 8 am
        });

        builder.Services.AddQuartzHostedService(q => q.WaitForJobsToComplete = true);

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
                        new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey))
                };
            });
        builder.Services.AddAuthorization(options =>
        {
            options.AddPolicy("CenterAdmin", policyBuilder => policyBuilder.RequireRole(Role.CenterAdmin.ToString()));
            options.AddPolicy("HospitalAdmin",
                policyBuilder => policyBuilder.RequireRole(Role.HospitalAdmin.ToString()));
            options.AddPolicy("PharmaAdmin", policyBuilder => policyBuilder.RequireRole(Role.PharmaAdmin.ToString()));
            options.AddPolicy("AdminPolicy", policyBuilder => policyBuilder.RequireRole(Role.Admin.ToString()));
            options.AddPolicy("Donor",
                policyBuilder => policyBuilder.RequireRole(Role.Donor.ToString()));
        });

        #endregion

        #region Cors

        builder.Services.AddCors(opts =>
        {
            opts.AddPolicy("AllowAll",
                corsPolicyBuilder =>
                {
                    corsPolicyBuilder.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:5173",
                            "https://app.liveflow53.com")
                        .AllowCredentials();
                });
        });

        #endregion


        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        app.UseRouting();
        app.UseCors("AllowAll");

        #region Hub

        app.MapHub<NotificationHub>("/notificationHub");

        #endregion

        // app.UseAuthentication();
        // app.UseAuthorization();
        // app.UseWatchDogExceptionLogger();

        // var watchdogCredentials = builder.Configuration.GetSection("WatchDog");
        // app.UseWatchDog(opt =>
        // {
        //     opt.WatchPageUsername = watchdogCredentials["username"];
        //     opt.WatchPagePassword = watchdogCredentials["password"];
        // });

        app.MapControllers();

        app.Run();
    }
}
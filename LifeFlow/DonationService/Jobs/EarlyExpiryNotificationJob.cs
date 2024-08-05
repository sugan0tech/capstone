using DonationService.Commons;
using DonationService.Commons.Enums;
using DonationService.Entities;
using DonationService.Features.Notification;
using DonationService.Features.User;
using Quartz;

namespace DonationService.Jobs;

public class EarlyExpiryNotificationJob(IServiceScopeFactory scopeFactory) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        using var scope = scopeFactory.CreateScope();
        var unitBagRepo = scope.ServiceProvider.GetRequiredService<IBaseRepo<UnitBag>>();
        var notificationService = scope.ServiceProvider.GetRequiredService<NotificationService>();
        var userService = scope.ServiceProvider.GetRequiredService<IUserService>();

        var nearExpiryBags = unitBagRepo.GetAll().Result.Where(b => b.Expiry < DateTime.UtcNow.AddDays(5)).ToList();
        var admins = (await userService.GetAll()).FindAll(user => user.Role.Equals(Role.Admin.ToString()));

        foreach (var userDto in admins)
        foreach (var bag in nearExpiryBags)
        {
            var notification = new NotificationDto
            {
                receiverId = userDto.Id,
                receiverKind = "User",
                Message =
                    $"UnitBag with ID {bag.Id} is expiring soon (Expiry Date: {bag.Expiry.ToShortDateString()})."
            };

            await notificationService.SendNotification(notification);
        }
    }
}
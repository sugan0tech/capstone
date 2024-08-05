using DonationService.Commons;
using DonationService.Commons.Enums;
using DonationService.Entities;
using DonationService.Features.Notification;
using DonationService.Features.User;
using Quartz;

namespace DonationService.Jobs;

public class CheckExpiryJob(IServiceScopeFactory factory) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        using var scope = factory.CreateScope();
        var unitBagRepo = scope.ServiceProvider.GetRequiredService<IBaseRepo<UnitBag>>();
        var notificationService = scope.ServiceProvider.GetRequiredService<NotificationService>();
        var userService = scope.ServiceProvider.GetRequiredService<IUserService>();

        var expiredBags = unitBagRepo.GetAll().Result.Where(b => b.Expiry < DateTime.UtcNow).ToList();
        var admins = (await userService.GetAll()).FindAll(user => user.Role.Equals(Role.Admin.ToString()));

        foreach (var userDto in admins)
        foreach (var bag in expiredBags)
        {
            var notification = new NotificationDto
            {
                receiverId = userDto.Id,
                receiverKind = "User",
                Message = $"UnitBag with ID {bag.Id} has expired and has been removed."
            };

            await unitBagRepo.DeleteById(bag.Id);
            await notificationService.SendNotification(notification);
        }
    }
}
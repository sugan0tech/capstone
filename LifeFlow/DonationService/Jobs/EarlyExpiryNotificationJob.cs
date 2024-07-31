using DonationService.Commons;
using DonationService.Entities;
using DonationService.Features.Notification;
using Quartz;

namespace DonationService.Jobs;

public class EarlyExpiryNotificationJob(IServiceScopeFactory scopeFactory) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        using var scope = scopeFactory.CreateScope();
        var unitBagRepo = scope.ServiceProvider.GetRequiredService<IBaseRepo<UnitBag>>();
        var notificationService = scope.ServiceProvider.GetRequiredService<NotificationService>();

        var nearExpiryBags = unitBagRepo.GetAll().Result.Where(b => b.Expiry < DateTime.UtcNow.AddDays(5)).ToList();

        foreach (var bag in nearExpiryBags)
        {
            var notification = new NotificationDto
            {
                receiverId = bag.CenterId,
                receiverKind = "Center",
                Message = $"UnitBag with ID {bag.Id} is expiring soon (Expiry Date: {bag.Expiry.ToShortDateString()})."
            };

            await notificationService.SendNotification(notification);
        }
    }
}
using DonationService.Commons;
using DonationService.Entities;
using DonationService.Features.Notification;
using Quartz;

namespace DonationService.Jobs;

public class CheckExpiryJob(IServiceScopeFactory factory) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        using var scope = factory.CreateScope();
        var unitBagRepo = scope.ServiceProvider.GetRequiredService<IBaseRepo<UnitBag>>();
        var notificationService = scope.ServiceProvider.GetRequiredService<NotificationService>();

        var expiredBags = unitBagRepo.GetAll().Result.Where(b => b.Expiry < DateTime.UtcNow).ToList();

        foreach (var bag in expiredBags)
        {
            var notification = new NotificationDto
            {
                receiverId = bag.CenterId,
                receiverKind = "Center",
                Message = $"UnitBag with ID {bag.Id} has expired and has been removed."
            };

            await unitBagRepo.DeleteById(bag.Id);
            await notificationService.SendNotification(notification);
        }
    }
}
using DonationService.Commons;
using DonationService.Entities;
using DonationService.Features.Donor;
using DonationService.Features.Notification;
using Quartz;

namespace DonationService.Jobs;

public class SlotNotificationJob(IServiceScopeFactory scopeFactory) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        using var scope = scopeFactory.CreateScope();
        var donationSlotRepo = scope.ServiceProvider.GetRequiredService<IBaseRepo<DonationSlot>>();
        var notificationService = scope.ServiceProvider.GetRequiredService<NotificationService>();
        var donorService = scope.ServiceProvider.GetRequiredService<IDonorService>();
        var upcomingSlots = donationSlotRepo.GetAll().Result
            .Where(s => s.SlotTime > DateTime.UtcNow && s.SlotTime < DateTime.UtcNow.AddMinutes(30));
        foreach (var slot in upcomingSlots)
        {
            var userId = donorService.GetById(slot.DonorId).Result.UserId;
            var notification = new NotificationDto
            {
                receiverId = userId,
                receiverKind = "User",
                Message = $"Reminder: Your donation slot is coming up soon at {slot.SlotTime.ToShortTimeString()}."
            };
            await notificationService.SendNotification(notification);
        }
    }
}
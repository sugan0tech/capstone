using DonationService.Features.Donor;
using DonationService.Features.Notification;
using Quartz;

namespace DonationService.Jobs;

public class DonationRequestJob(IServiceScopeFactory scopeFactory) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        using var scope = scopeFactory.CreateScope();
        var donorService = scope.ServiceProvider.GetRequiredService<IDonorService>();
        var notificationService = scope.ServiceProvider.GetRequiredService<NotificationService>();

        var donors = donorService.GetAll().Result.Where(dto =>
                dto.LastDonationTime == null || dto.LastDonationTime.Value.AddMonths(4) < DateTime.UtcNow)
            .ToList();

        foreach (var donor in donors)
        {
            var notification = new NotificationDto
            {
                receiverId = donor.UserId,
                receiverKind = "Donor",
                Message = "You're a lifesaver! A nearby blood drive needs your help. Donate now at #LifeFlow"
            };

            await notificationService.SendNotification(notification);
        }
    }
}
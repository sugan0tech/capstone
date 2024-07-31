using DonationService.Commons;

namespace DonationService.Features.Notification;

public class NotificationRepo(DonationServiceContext context) : BaseRepo<Entities.Notification>(context)
{
}
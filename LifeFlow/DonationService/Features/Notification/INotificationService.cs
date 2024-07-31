namespace DonationService.Features.Notification;

public interface INotificationService
{
    public Task SendNotification(NotificationDto notification);
    public Task CheckPendingNotifications(int receiverId);
    public Task<List<NotificationDto>> GetPendingNotifications(int receiverId);
    public Task MarkNotificationsAsSent(int notificationId);
    public Task MarkAsRead(int notificationId);
}
using AutoMapper;
using DonationService.Commons;
using Microsoft.AspNetCore.SignalR;
using WatchDog;

namespace DonationService.Features.Notification;

public class NotificationService(
    IHubContext<NotificationHub> hubContext,
    IBaseRepo<Entities.Notification> repo,
    IMapper mapper) : BaseService<Entities.Notification, NotificationDto>(repo, mapper), INotificationService
{
    public async Task SendNotification(NotificationDto notification)
    {
        try
        {
            await hubContext.Clients.User(notification.receiverId.ToString())
                .SendAsync("ReceiveNotification", notification.Message);
            notification.IsSent = true;
        }
        catch (Exception e)
        {
            WatchLogger.LogError(e.Message);
        }
        finally
        {
            await Add(notification);
        }
    }

    public async Task CheckPendingNotifications(int receiverId)
    {
        var pendingNotifications = await GetPendingNotifications(receiverId);
        if (pendingNotifications.Any())
        {
            await hubContext.Clients.User(receiverId.ToString())
                .SendAsync("ReceiveNotification", $"You have {pendingNotifications.Count} new notifications.");

            pendingNotifications.ForEach(async pn =>
                await MarkNotificationsAsSent(pn.Id)
            );
        }
    }

    public Task<List<NotificationDto>> GetPendingNotifications(int receiverId)
    {
        return Task.FromResult(GetAll().Result.FindAll(n => n.receiverId.Equals(receiverId)));
    }

    public async Task MarkNotificationsAsSent(int notificationId)
    {
        var notification = await repo.GetById(notificationId);
        notification.IsSent = true;
        await repo.Add(notification);
    }

    public async Task MarkAsRead(int notificationId)
    {
        var notification = await repo.GetById(notificationId);
        notification.IsViewed = true;
        await repo.Add(notification);
    }
}
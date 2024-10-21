using AutoMapper;
using DonationService.Commons;
using Microsoft.AspNetCore.SignalR;

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
            notification.IsSent = await SendToClient(notification.receiverId.ToString(), notification.Message);
        }
        catch (Exception e)
        {
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
            var status = await SendToClient(receiverId.ToString(),
                $"You have {pendingNotifications.Count} new notifications.");

            if (status)
            {
                foreach (var pn in pendingNotifications)
                {
                    await MarkNotificationsAsSent(pn.Id);
                }            }
        }
    }

    public async Task<List<NotificationDto>> GetPendingNotifications(int receiverId)
    {
        var notifications = await GetAll();
        var notificationDtos = notifications.FindAll(n => n.receiverId.Equals(receiverId) && !n.IsViewed);
        return notificationDtos;
    }

    public async Task MarkNotificationsAsSent(int notificationId)
    {
        var notification = await repo.GetById(notificationId);
        notification.IsSent = true;
        await repo.Update(notification);
    }

    public async Task MarkAsRead(int notificationId)
    {
        var notification = await repo.GetById(notificationId);
        notification.IsViewed = true;
        await repo.Update(notification);
    }

    private async Task<bool> SendToClient(string receiverId, string message)
    {
        if (NotificationHub.UserConnections.TryGetValue(receiverId, out var connectionId))
        {
            await hubContext.Clients.Client(connectionId)
                .SendAsync("ReceiveNotification", message);
            return true;
        }

        return false;
    }
}
using Microsoft.AspNetCore.SignalR;
using WatchDog;

namespace DonationService.Features.Notification;

public class NotificationHub(NotificationService notificationService) : Hub
{
    public static readonly Dictionary<string, string> UserConnections = new();

    public override async Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        var receiverId = httpContext.Request.Query["receiverId"].ToString();

        WatchLogger.Log($"User connected: {receiverId}, ConnectionId: {Context.ConnectionId}");
        if (!string.IsNullOrEmpty(receiverId)) UserConnections[receiverId] = Context.ConnectionId;

        await notificationService.CheckPendingNotifications(int.Parse(receiverId));
    }

    public override Task OnDisconnectedAsync(Exception exception)
    {
        var connection = UserConnections.FirstOrDefault(x => x.Value == Context.ConnectionId);
        if (!string.IsNullOrEmpty(connection.Key)) UserConnections.Remove(connection.Key);
    
        return base.OnDisconnectedAsync(exception);
    }
}
using Microsoft.AspNetCore.SignalR;
using WatchDog;

namespace DonationService.Features.Notification;

public class NotificationHub : Hub
{
    private static readonly Dictionary<string, string> UserConnections = new ();

    public override Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        var receiverId = httpContext.Request.Query["receiverId"].ToString();

        if (!string.IsNullOrEmpty(receiverId))
        {
            UserConnections[receiverId] = Context.ConnectionId;
        }

        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception exception)
    {
        var connection = UserConnections.FirstOrDefault(x => x.Value == Context.ConnectionId);
        if (!string.IsNullOrEmpty(connection.Key))
        {
            UserConnections.Remove(connection.Key);
        }

        return base.OnDisconnectedAsync(exception);
    }

    public async Task SendNotification(string receiverId, string message)
    {
        WatchLogger.Log("stuff for signal r");
        if (UserConnections.TryGetValue(receiverId, out var connectionId))
        {
            WatchLogger.Log(connectionId);
            await Clients.Client(connectionId).SendAsync("ReceiveNotification", message);
        }
    }}
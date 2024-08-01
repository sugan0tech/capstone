using DonationService.Commons.Enums;
using DonationService.Features.Notification;
using DonationService.Features.Orders;
using Quartz;

namespace DonationService.Jobs;

public class OrderPaymentNotifyJob(IServiceScopeFactory scopeFactory) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        using var scope = scopeFactory.CreateScope();
        var orderService = scope.ServiceProvider.GetRequiredService<OrderService>();
        var notificationService = scope.ServiceProvider.GetRequiredService<NotificationService>();

        var paymentPendingOrders = orderService.GetAll().Result.Where(dto =>
                dto.Status.Equals(OrderStatus.Pending)
            )
            .ToList();

        var clients = new Dictionary<int, int>();
        foreach (var order in paymentPendingOrders)
        {
            clients.TryAdd(order.ClientId, 0);
            clients[order.ClientId]++;
        }

        foreach (var clientId in clients.Keys)
        {
            var notification = new NotificationDto
            {
                receiverId = clientId,
                receiverKind = "Client",
                Message = $"Payment for your recent {clients[clientId]} Order is pending"
            };

            await notificationService.SendNotification(notification);
        }
    }
}
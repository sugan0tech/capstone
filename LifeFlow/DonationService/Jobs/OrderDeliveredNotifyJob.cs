using DonationService.Commons.Enums;
using DonationService.Features.Notification;
using DonationService.Features.Orders;
using DonationService.Features.User;
using Quartz;

namespace DonationService.Jobs;

public class OrderDeliveredNotifyJob(IServiceScopeFactory scopeFactory) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        using var scope = scopeFactory.CreateScope();
        var orderService = scope.ServiceProvider.GetRequiredService<OrderService>();
        var userService = scope.ServiceProvider.GetRequiredService<IUserService>();
        var notificationService = scope.ServiceProvider.GetRequiredService<NotificationService>();

        var deliveredOrders = orderService.GetAll().Result.Where(dto =>
                dto.DeliveryDate != null && dto.Status.Equals(OrderStatus.Delivered) &&
                dto.DeliveryDate.Value.Date.Equals(DateTime.UtcNow.Date)
            )
            .ToList();

        var admins = userService.GetAll().Result.Where(user => user.Role.Equals(Role.Admin.ToString()));
        foreach (var admin in admins)
        {
            var notification = new NotificationDto

            {
                receiverId = admin.Id,
                // admins also belongs to user group
                receiverKind = "User",
                Message = $"{deliveredOrders.Count} Orders delivered"
            };

            await notificationService.SendNotification(notification);
        }
    }
}
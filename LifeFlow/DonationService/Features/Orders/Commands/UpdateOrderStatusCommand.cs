using DonationService.Commons.Enums;

namespace DonationService.Features.Orders.Commands;

public class UpdateOrderStatusCommand(int orderId, OrderStatus status)
{
    public int OrderId { get; set; } = orderId;
    public OrderStatus status { get; set; } = status;
}
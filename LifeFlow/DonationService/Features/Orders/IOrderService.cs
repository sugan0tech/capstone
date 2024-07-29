namespace DonationService.Features.Orders;

public interface IOrderService
{
    public OrderDto makeOrder(OrderRequestDto request);
    public List<OrderDto> PendingOrders(string centerName);
}
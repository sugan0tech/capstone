namespace DonationService.Features.Orders;

public interface IOrderService
{
    public Task<OrderDto> MakeOrder(OrderRequestDto request);
    public List<OrderDto> PendingOrders(string centerName);
}
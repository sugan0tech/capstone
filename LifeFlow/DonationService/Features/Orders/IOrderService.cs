namespace DonationService.Features.Orders;

public interface IOrderService
{
    public Task<OrderDto> MakeOrder(OrderRequestDto request);
    public Task<List<OrderDto>> PendingOrders(string centerName);
}
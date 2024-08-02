namespace DonationService.Features.Orders;

public interface IOrderService
{
    public Task<OrderDto> MakeOrder(OrderRequestDto request);
    public Task<List<OrderDto>> CenterOrders(string centerName);
    public Task<List<OrderDto>> ClientOrders(int clientId);
}
using AutoMapper;
using DonationService.Commons;
using DonationService.Entities;

namespace DonationService.Features.Orders;

public class OrderService(IBaseRepo<Order> repo, IMapper mapper)
    : BaseService<Order, OrderDto>(repo, mapper), IOrderService
{
    public OrderDto makeOrder(OrderRequestDto request)
    {
        throw new NotImplementedException();
    }

    public List<OrderDto> PendingOrders(string centerName)
    {
        throw new NotImplementedException();
    }
}
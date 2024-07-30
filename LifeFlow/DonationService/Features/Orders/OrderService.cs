using AutoMapper;
using DonationService.Commons;
using DonationService.Entities;
using DonationService.Features.Payment;
using DonationService.Features.UnitBag;

namespace DonationService.Features.Orders;

public class OrderService(
    IBaseRepo<Order> repo,
    IMapper mapper,
    IBaseService<Entities.UnitBag, UnitBagDto> unitBagService, 
    PaymentService paymentService)
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
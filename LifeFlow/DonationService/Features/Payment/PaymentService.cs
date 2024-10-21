using AutoMapper;
using DonationService.Commons;
using DonationService.Commons.Enums;
using DonationService.Features.Address.Command;
using DonationService.Features.Orders.Commands;

namespace DonationService.Features.Payment;

public class PaymentService(
    IBaseRepo<Entities.Payment> repo,
    IOrderCommandHandler<UpdateOrderStatusCommand> commandHandler,
    IMapper mapper)
    : BaseService<Entities.Payment, PaymentDto>(repo, mapper), IPaymentService
{
    public async Task<PaymentDto> CreatePayment(int orderId, double amount, string method)
    {
        var payment = new Entities.Payment
        {
            OrderId = orderId,
            Amount = amount,
            PaymentDate = DateTime.UtcNow,
            PaymentMethod = method
        };
        payment = await repo.Add(payment);
        return mapper.Map<PaymentDto>(payment);
    }

    public async Task<PaymentDto> MakePayment(int paymentId, double amount, string method)
    {
        var payment = await repo.GetById(paymentId);
        await commandHandler.Handle(new UpdateOrderStatusCommand(payment.OrderId, OrderStatus.Approved));
        return mapper.Map<PaymentDto>(payment);
    }

    public PaymentDto GetPaymentByOrderId(int orderId)
    {
        var payment = repo.GetAll().Result.Find(payment => payment.OrderId.Equals(orderId));
        return mapper.Map<PaymentDto>(payment);
    }
}
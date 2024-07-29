using AutoMapper;
using DonationService.Commons;

namespace DonationService.Features.Payment;

public class PaymentService(IBaseRepo<Entities.Payment> repo, IMapper mapper)
    : BaseService<Entities.Payment, PaymentDto>(repo, mapper), IPaymentService
{
    public PaymentDto MakePayment(int OrderId, double amount, string method)
    {
        throw new NotImplementedException();
    }

    public PaymentDto GetPaymentByOrderId(int OrderId)
    {
        throw new NotImplementedException();
    }
}
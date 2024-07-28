using AutoMapper;
using DonationService.Commons;

namespace DonationService.Features.Payment;

public class PaymentService(IBaseRepo<Entities.Payment> repo, IMapper mapper)
    : BaseService<Entities.Payment, PaymentDto>(repo, mapper), IPaymentService
{
}
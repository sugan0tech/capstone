using DonationService.Commons;

namespace DonationService.Features.Payment;

public class PaymentRepo(DonationServiceContext context) : BaseRepo<Entities.Payment>(context);
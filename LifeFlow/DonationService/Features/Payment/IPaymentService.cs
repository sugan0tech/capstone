namespace DonationService.Features.Payment;

public interface IPaymentService
{
    public PaymentDto MakePayment(int OrderId, double amount, string method);
    public PaymentDto GetPaymentByOrderId(int OrderId);
}
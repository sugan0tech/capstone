namespace DonationService.Features.Payment;

public interface IPaymentService
{
    public Task<PaymentDto> CreatePayment(int orderId, double amount, string method);
    public Task<PaymentDto> MakePayment(int paymentId, double amount, string method);
    public PaymentDto GetPaymentByOrderId(int orderId);
}
namespace DonationService.Features.Payment;

public class MakePaymentDto
{
    public int PaymentId { get; set; }
    public double Amount { get; set; }
    public string Method { get; set; }
}
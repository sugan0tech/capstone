using DonationService.Entities;

namespace DonationService.Features.Payment;

public class PaymentDto
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public Order? Order { get; set; }
    public decimal Amount { get; set; }
    public DateTime PaymentDate { get; set; }
    public string PaymentMethod { get; set; } = "NetBanking";
    public string TransactionId { get; set; }
}
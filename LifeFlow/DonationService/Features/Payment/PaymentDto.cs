using DonationService.Entities;
using Newtonsoft.Json;

namespace DonationService.Features.Payment;

public class PaymentDto
{
    public int Id { get; set; }
    public int OrderId { get; set; }

    [JsonIgnore] public Order? Order { get; set; }

    public double Amount { get; set; }
    public DateTime PaymentDate { get; set; }
    public string PaymentMethod { get; set; } = "NetBanking";
    public string TransactionId { get; set; }
}
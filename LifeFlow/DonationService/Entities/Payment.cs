using System.ComponentModel.DataAnnotations.Schema;
using DonationService.Commons;

namespace DonationService.Entities;

public class Payment : BaseEntity
{
    [ForeignKey("OrderId")] public int OrderId { get; set; }
    public Order Order { get; set; }
    public decimal Amount { get; set; }
    public DateTime PaymentDate { get; set; }
    public string PaymentMethod { get; set; } = "NetBanking";
    public string TransactionId { get; set; }
}
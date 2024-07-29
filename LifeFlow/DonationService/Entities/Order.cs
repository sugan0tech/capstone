using System.ComponentModel.DataAnnotations.Schema;
using DonationService.Commons;
using DonationService.Commons.Enums;

namespace DonationService.Entities;

public class Order : BaseEntity
{
    [ForeignKey("ClientId")] public int ClientId { get; set; }
    public Client Client { get; set; }
    public OrderStatus Status { get; set; }
    public List<UnitBag> Items { get; set; }
    public int Quantity { get; set; }
    public double TotalPrice { get; set; }
    public string Description { get; set; }
    public OrderType OrderType { get; set; }
    public DateTime OrderDate { get; set; }
    public DateTime? DeliveryDate { get; set; }

    [ForeignKey("PaymentId")] public int PaymentId { get; set; }

    public Payment Payment { get; set; }
}
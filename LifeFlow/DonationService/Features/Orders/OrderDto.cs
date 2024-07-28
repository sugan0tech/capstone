using DonationService.Commons.Enums;
using DonationService.Entities;

namespace DonationService.Features.Orders;

public class OrderDto
{
    public int ClientId { get; set; }
    public Entities.Client Client { get; set; }
    public OrderStatus Status { get; set; }
    public List<Entities.UnitBag> Items { get; set; }
    public int Quantity { get; set; }
    public double TotalPrice { get; set; }
    public string Description { get; set; }
    public OrderType OrderType { get; set; }
    public DateTime OrderDate { get; set; }
    public DateTime? DeliveryDate { get; set; }
    public int PaymentId { get; set; }
    public Entities.Payment Payment { get; set; }
}
using System.Text.Json.Serialization;
using DonationService.Commons.Enums;

namespace DonationService.Features.Orders;

public class OrderDto
{
    public int Id { get; set; }
    public int ClientId { get; set; }
    [JsonIgnore]
    public Entities.Client Client { get; set; }
    public OrderStatus Status { get; set; }
    [JsonIgnore]
    public List<Entities.UnitBag> Items { get; set; }
    public int Quantity { get; set; }
    public double TotalPrice { get; set; }
    public string Description { get; set; }
    public OrderType OrderType { get; set; }
    public DateTime OrderDate { get; set; }
    public int PaymentId { get; set; }
    public DateTime? DeliveryDate { get; set; }
}
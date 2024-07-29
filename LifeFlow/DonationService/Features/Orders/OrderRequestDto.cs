using DonationService.Commons.Enums;

namespace DonationService.Features.Orders;

public class OrderRequestDto
{
    public int ClientId { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public List<BloodType> types { get; set; }
    public int MaxQuantity { get; set; }
    public string Description { get; set; }
    public OrderType OrderType { get; set; }
    public DateTime OrderDate { get; set; } = DateTime.Now;
    public DateTime? DeliveryDate { get; set; }
}
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
    public override string ToString()
    {
        return $"Order {{ Id = {Id}, ClientId = {ClientId}, Status = {Status}, Quantity = {Quantity}, " +
               $"TotalPrice = {TotalPrice:C}, Description = {Description}, OrderType = {OrderType}, " +
               $"OrderDate = {OrderDate}, DeliveryDate = {DeliveryDate}, PaymentId = {PaymentId}, " +
               $"ItemsCount = {Items?.Count ?? 0} }}";
    }
}
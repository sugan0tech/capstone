using System.Text.Json.Serialization;
using DonationService.Commons.Enums;
using DonationService.Features.Orders;

namespace DonationService.Features.UnitBag;

public record UnitBagDto
{
    public int Id { get; set; }
    public AntigenType Type { get; set; }
    public BloodSubtype BloodSubtype { get; set; } = BloodSubtype.Rhd;
    public BloodType BloodType { get; set; }
    public DateTime Expiry { get; set; }
    public required int DonorId { get; set; }
    public required int CenterId { get; set; }
    public int? OrderId { get; set; }

    [JsonIgnore] public OrderDto? Order { get; set; }

    public bool IsRare { get; set; } = false;
    public bool IsSold { get; set; } = false;
}
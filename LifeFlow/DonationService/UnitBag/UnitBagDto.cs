using DonationService.Commons.Enums;

namespace DonationService.UnitBag;

public record UnitBagDto
{
    public int Id { get; set; }
    public AntigenType Type { get; set; }
    public BloodSubtype BloodSubtype { get; set; } = BloodSubtype.Rhd;
    public BloodType BloodType { get; set; }
    public DateTime Expiry { get; set; }
    public required int DonorId { get; set; }
    public required int CenterId { get; set; }
    public bool IsRare { get; set; } = false;
}
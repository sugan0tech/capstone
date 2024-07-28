using DonationService.Commons;
using DonationService.Commons.Enums;

namespace DonationService.Entities;

public class UnitBag : BaseEntity
{
    public AntigenType Type { get; set; }
    public BloodSubtype BloodSubtype { get; set; } = BloodSubtype.Rhd;
    public BloodType BloodType { get; set; }
    public DateTime Expiry { get; set; }
    public required int DonorId { get; set; }
    public required int CenterId { get; set; }
    public bool IsRare { get; set; } = false;
}
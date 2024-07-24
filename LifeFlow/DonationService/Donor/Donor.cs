using DonationService.Commons;
using DonationService.Commons.Enums;

namespace DonationService.Donor;

public class Donor: BaseEntity
{
    public int UserId { get; set; }
    public AntigenType BloodAntigenType { get; set; }
    public BloodSubtype BloodSubtype { get; set; }
    public DateTime? LastDonationTime { get; set; }
    public int? AddressId { get; set; }
}
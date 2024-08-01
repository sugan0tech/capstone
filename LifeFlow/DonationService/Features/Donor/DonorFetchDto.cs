using DonationService.Commons.Enums;

namespace DonationService.Features.Donor;

public class DonorFetchDto
{
    public int UserId { get; init; }
    public AntigenType BloodAntigenType { get; init; }
    public BloodSubtype BloodSubtype { get; init; }
    public DateTime? LastDonationTime { get; set; }
    public int? AddressId { get; set; }
    public double distance { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
}
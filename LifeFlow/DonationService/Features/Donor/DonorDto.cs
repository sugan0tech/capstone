using DonationService.Commons.Enums;

namespace DonationService.Features.Donor;

public record DonorDto
{
    public int Id { get; set; }
    public int UserId { get; init; }
    public AntigenType BloodAntigenType { get; init; }
    public BloodSubtype BloodSubtype { get; init; }
    public DateTime? LastDonationTime { get; set; }
    public int? AddressId { get; set; }
}
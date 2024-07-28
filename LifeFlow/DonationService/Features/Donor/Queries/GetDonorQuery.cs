using MediatR;

namespace DonationService.Features.Donor.Queries;

public class GetDonorQuery(int donorId) : IRequest<DonorDto>
{
    public int DonorId { get; init; } = donorId;
}
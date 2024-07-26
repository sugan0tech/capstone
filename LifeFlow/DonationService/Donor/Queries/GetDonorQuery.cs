using DonationService.User;
using MediatR;

namespace DonationService.Donor.Queries;

public class GetDonorQuery(int donorId) : IRequest<DonorDto>
{
    public int DonorId { get; init; } = donorId;
}
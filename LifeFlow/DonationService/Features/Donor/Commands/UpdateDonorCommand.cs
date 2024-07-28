using MediatR;

namespace DonationService.Features.Donor.Commands;

public class UpdateDonorCommand(DonorDto donor) : IRequest<DonorDto>
{
    public DonorDto DonorDto { get; set; } = donor;
}
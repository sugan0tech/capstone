using MediatR;

namespace DonationService.Donor.Commands;

public class UpdateDonorCommand : IRequest<DonorDto>
{
    public DonorDto DonorDto { get; set; }
}
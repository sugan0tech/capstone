using MediatR;

namespace DonationService.Donor.Commands;

public class UpdateDonorCommand (DonorDto donor ): IRequest<DonorDto>
{
    public DonorDto DonorDto { get; set; } = donor;
}
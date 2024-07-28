using MediatR;

namespace DonationService.Features.BloodCenter.Commands;

public class UpdateBloodCenterCommand(BloodCenterDto centre) : IRequest<BloodCenterDto>
{
    public BloodCenterDto BloodCenterDto { get; set; } = centre;
}
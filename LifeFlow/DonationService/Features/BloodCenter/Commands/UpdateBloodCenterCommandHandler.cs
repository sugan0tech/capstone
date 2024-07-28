using DonationService.Features.Donor.Commands;
using MediatR;

namespace DonationService.Features.BloodCenter.Commands;

public class UpdateBloodCenterCommandHandler(
    BloodCenterService bloodCenterService,
    IMediator mediator,
    ILogger<UpdateDonorCommandHandler> logger) : IRequestHandler<UpdateBloodCenterCommand, BloodCenterDto>
{
    public Task<BloodCenterDto> Handle(UpdateBloodCenterCommand request, CancellationToken cancellationToken)
    {
        return bloodCenterService.Update(request.BloodCenterDto);
    }
}
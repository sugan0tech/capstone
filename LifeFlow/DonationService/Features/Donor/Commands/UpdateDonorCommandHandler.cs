using MediatR;

namespace DonationService.Features.Donor.Commands;

public class UpdateDonorCommandHandler(
    IDonorService donorService,
    IMediator mediator,
    ILogger<UpdateDonorCommandHandler> logger) : IRequestHandler<UpdateDonorCommand, DonorDto>
{
    public Task<DonorDto> Handle(UpdateDonorCommand request, CancellationToken cancellationToken)
    {
        return donorService.Update(request.DonorDto);
    }
}
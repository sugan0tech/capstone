using DonationService.Features.Donor.Commands;
using MediatR;

namespace DonationService.Features.Client.Commands;

public class UpdateClientCommandHandler(
    ClientService clientService,
    IMediator mediator,
    ILogger<UpdateDonorCommandHandler> logger) : IRequestHandler<UpdateClientCommand, ClientDto>
{
    public Task<ClientDto> Handle(UpdateClientCommand request, CancellationToken cancellationToken)
    {
        return clientService.Update(request.ClientDto);
    }
}
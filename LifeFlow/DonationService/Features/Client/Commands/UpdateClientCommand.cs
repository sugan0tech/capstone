using MediatR;

namespace DonationService.Features.Client.Commands;

public class UpdateClientCommand(ClientDto client) : IRequest<ClientDto>
{
    public ClientDto ClientDto { get; set; } = client;
}
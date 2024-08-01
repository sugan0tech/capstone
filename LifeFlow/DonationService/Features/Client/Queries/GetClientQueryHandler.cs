using MediatR;

namespace DonationService.Features.Client.Queries;

public class GetClientQueryHandler(ClientService clientService) : IRequestHandler<GetClientQuery, ClientDto>
{
    public Task<ClientDto> Handle(GetClientQuery request, CancellationToken cancellationToken)
    {
        return clientService.GetById(request.ClientId);
    }
}
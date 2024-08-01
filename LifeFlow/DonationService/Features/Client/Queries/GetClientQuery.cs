using MediatR;

namespace DonationService.Features.Client.Queries;

public class GetClientQuery(int clientId) : IRequest<ClientDto>
{
    public int ClientId { get; init; } = clientId;
}
using AutoMapper;
using DonationService.Commons;
using DonationService.Exceptions;

namespace DonationService.Features.Client;

public class ClientService(IBaseRepo<Entities.Client> repo, IMapper mapper)
    : BaseService<Entities.Client, ClientDto>(repo, mapper), IClientService
{
    public async Task<ClientDto> getByUserId(int userId)
    {
        var clients = await GetAll();
        return clients.Find(dto => dto.ManagedById.Equals(userId)) ??
               throw new EntityNotFoundException("No Client found for user");
    }
}
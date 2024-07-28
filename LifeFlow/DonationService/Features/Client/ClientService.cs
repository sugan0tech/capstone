using AutoMapper;
using DonationService.Commons;

namespace DonationService.Features.Client;

public class ClientService(IBaseRepo<Entities.Client> repo, IMapper mapper)
    : BaseService<Entities.Client, ClientDto>(repo, mapper), IClientService
{
}
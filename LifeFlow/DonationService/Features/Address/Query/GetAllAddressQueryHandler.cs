using AutoMapper;
using DonationService.Commons;

namespace DonationService.Features.Address.Query;

public class GetAllAddressesQueryHandler(IBaseRepo<Entities.Address> repository, IMapper mapper)
    : IQueryHandler<GetAllAddressesQuery, List<AddressDto>>
{
    public async Task<List<AddressDto>> Handle(GetAllAddressesQuery query)
    {
        var addresses = await repository.GetAll();
        return addresses.Select(a => mapper.Map<AddressDto>(a)).ToList();
    }
}
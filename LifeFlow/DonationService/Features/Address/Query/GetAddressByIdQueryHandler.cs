using AutoMapper;
using DonationService.Commons;

namespace DonationService.Features.Address.Query;

public class GetAddressByIdQueryHandler(IBaseRepo<Entities.Address> repository, IMapper mapper)
    : IQueryHandler<GetAddressByIdQuery, AddressDto>
{
    public async Task<AddressDto> Handle(GetAddressByIdQuery query)
    {
        var address = await repository.GetById(query.Id);
        if (address == null) throw new KeyNotFoundException();

        return mapper.Map<AddressDto>(address);
    }
}
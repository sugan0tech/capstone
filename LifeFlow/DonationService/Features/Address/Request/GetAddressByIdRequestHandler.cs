using AutoMapper;
using DonationService.Commons;
using MediatR;

namespace DonationService.Features.Address.Request;

public class GetAddressByIdRequestHandler(IBaseRepo<Entities.Address> repository, IMapper mapper)
    : IRequestHandler<GetAddressByIdRequest, AddressDto>
{
    public async Task<AddressDto> Handle(GetAddressByIdRequest request, CancellationToken cancellationToken)
    {
        var address = await repository.GetById(request.AddressId);
        if (address == null) throw new KeyNotFoundException();

        return mapper.Map<AddressDto>(address);
    }
}
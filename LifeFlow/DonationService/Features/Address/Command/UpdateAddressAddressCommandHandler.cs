using AutoMapper;
using DonationService.Commons;

namespace DonationService.Features.Address.Command;

public class UpdateAddressAddressCommandHandler(IBaseRepo<Entities.Address> repository, IMapper mapper)
    : IAddressCommandHandler<UpdateAddressCommand>
{
    public async Task<AddressDto> Handle(UpdateAddressCommand command)
    {
        // var address = await repository.GetById(command.Address.Id);
        // if (address == null) throw new KeyNotFoundException();

        var address = mapper.Map<Entities.Address>(command.Address);

        var addr =await repository.Update(address);
        return mapper.Map<AddressDto>(addr);
    }
}
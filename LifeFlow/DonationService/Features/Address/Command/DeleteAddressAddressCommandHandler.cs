using AutoMapper;
using DonationService.Commons;

namespace DonationService.Features.Address.Command;

public class DeleteAddressAddressCommandHandler(IBaseRepo<Entities.Address> repository, IMapper mapper)
    : IAddressCommandHandler<DeleteAddressCommand>
{
    public async Task<AddressDto> Handle(DeleteAddressCommand command)
    {
        var address = await repository.GetById(command.Id);
        if (address == null) throw new KeyNotFoundException();

        var addr = await repository.DeleteById(address.Id);
        return mapper.Map<AddressDto>(addr);
    }
}
using AutoMapper;
using DonationService.Commons;

namespace DonationService.Address.Command;

public class UpdateAddressCommandHandler(IBaseRepo<Address> repository, IMapper mapper)
    : ICommandHandler<UpdateAddressCommand>
{
    public async Task Handle(UpdateAddressCommand command)
    {
        var address = await repository.GetById(command.Address.Id);
        if (address == null) throw new KeyNotFoundException();

        mapper.Map(address, command.Address);

        await repository.Update(address);
    }
}
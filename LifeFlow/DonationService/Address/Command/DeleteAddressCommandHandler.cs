using DonationService.Commons;

namespace DonationService.Address.Command;

public class DeleteAddressCommandHandler(IBaseRepo<Address> repository)
    : ICommandHandler<DeleteAddressCommand>
{
    public async Task Handle(DeleteAddressCommand command)
    {
        var address = await repository.GetById(command.Id);
        if (address == null) throw new KeyNotFoundException();

        await repository.DeleteById(address.Id);
    }
}
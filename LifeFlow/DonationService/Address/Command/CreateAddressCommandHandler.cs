using AutoMapper;
using DonationService.Commons;
using DonationService.Exceptions;
using MediatR;

namespace DonationService.Address.Command;

public class CreateAddressCommandHandler(IBaseRepo<Address> repository, IMediator mediator, IMapper mapper)
    : ICommandHandler<CreateAddressCommand>
{
    public async Task Handle(CreateAddressCommand command)
    {
        if (repository.GetAll().Result.Exists(address =>
                address.EntityId.Equals(command.Address.EntityId) &&
                address.EntityType.Equals(command.Address.EntityType)))
        {
            throw new AlreadyExistingEntityException(
                "Unable to create new address, Address for the user already exists. consider updating it");
        }

        // var user = await mediator.Send(new GetUserQuery(command.UserId));

        var address = mapper.Map<Address>(command.Address);

        await repository.Add(address);
    }
}
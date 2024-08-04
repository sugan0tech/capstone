using AutoMapper;
using DonationService.Commons;
using DonationService.Exceptions;
using DonationService.Features.BloodCenter.Commands;
using DonationService.Features.BloodCenter.Queries;
using DonationService.Features.Client.Commands;
using DonationService.Features.Client.Queries;
using DonationService.Features.Donor.Commands;
using DonationService.Features.Donor.Queries;
using MediatR;

namespace DonationService.Features.Address.Command;

public class CreateAddressAddressCommandHandler(IBaseRepo<Entities.Address> repository, IMediator mediator, IMapper mapper)
    : IAddressCommandHandler<CreateAddressCommand>
{
    public async Task<AddressDto> Handle(CreateAddressCommand command)
    {
        if (repository.GetAll().Result.Exists(address =>
                address.EntityId.Equals(command.Address.EntityId) &&
                address.EntityType.Equals(command.Address.EntityType)))
            throw new AlreadyExistingEntityException(
                "Unable to create new address, Address for the user already exists. consider updating it");

        // validation for entity existance
        var address = mapper.Map<Entities.Address>(command.Address);
        Entities.Address addr;
        switch (command.Address.EntityType)
        {
            case "Donor":
                var donor = await mediator.Send(new GetDonorQuery(command.Address.EntityId));
                addr = await repository.Add(address);
                donor.AddressId = address.Id;
                await mediator.Send(new UpdateDonorCommand(donor));
                return mapper.Map<AddressDto>(addr);
            case "BloodCenter":
                var centre = await mediator.Send(new GetBloodCenterQuery(command.Address.EntityId));
                addr = await repository.Add(address);
                centre.AddressId = address.Id;
                await mediator.Send(new UpdateBloodCenterCommand(centre));
                return mapper.Map<AddressDto>(addr);
            case "Client":
                var client = await mediator.Send(new GetClientQuery(command.Address.EntityId));
                addr = await repository.Add(address);
                client.AddressId = address.Id;
                await mediator.Send(new UpdateClientCommand(client));
                return mapper.Map<AddressDto>(addr);
            default:
                throw new InvalidEntityTypeException($"{command.Address.EntityType} is not of accepted types");
        }
    }
}
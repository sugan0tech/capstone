using AutoMapper;
using DonationService.Commons;
using DonationService.Exceptions;
using DonationService.Features.BloodCenter.Commands;
using DonationService.Features.BloodCenter.Queries;
using DonationService.Features.Donor.Commands;
using DonationService.Features.Donor.Queries;
using MediatR;

namespace DonationService.Features.Address.Command;

public class CreateAddressCommandHandler(IBaseRepo<Entities.Address> repository, IMediator mediator, IMapper mapper)
    : ICommandHandler<CreateAddressCommand>
{
    public async Task Handle(CreateAddressCommand command)
    {
        if (repository.GetAll().Result.Exists(address =>
                address.EntityId.Equals(command.Address.EntityId) &&
                address.EntityType.Equals(command.Address.EntityType)))
            throw new AlreadyExistingEntityException(
                "Unable to create new address, Address for the user already exists. consider updating it");

        // validation for entity existance
        var address = mapper.Map<Entities.Address>(command.Address);
        switch (command.Address.EntityType)
        {
            case "Donor":
                var donor = await mediator.Send(new GetDonorQuery(command.Address.EntityId));
                await repository.Add(address);
                donor.AddressId = address.Id;
                await mediator.Send(new UpdateDonorCommand(donor));
                break;
            case "BloodCenter":
                var centre = await mediator.Send(new GetBloodCenterQuery(command.Address.EntityId));
                await repository.Add(address);
                centre.AddressId = address.Id;
                await mediator.Send(new UpdateBloodCenterCommand(centre));
                break;
            case "Hospital":
                break;
            default:
                throw new InvalidEntityTypeException($"{command.Address.EntityType} is not of accepted types");
        }
    }
}
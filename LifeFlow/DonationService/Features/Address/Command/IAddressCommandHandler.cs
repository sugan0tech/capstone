namespace DonationService.Features.Address.Command;

public interface IAddressCommandHandler<TCommand>
{
    Task<AddressDto> Handle(TCommand command);
}
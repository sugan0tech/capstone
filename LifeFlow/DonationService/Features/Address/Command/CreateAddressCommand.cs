namespace DonationService.Features.Address.Command;

public class CreateAddressCommand(AddressDto address)
{
    public AddressDto Address { get; set; } = address;
}
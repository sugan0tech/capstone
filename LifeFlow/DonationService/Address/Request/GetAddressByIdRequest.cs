using MediatR;

namespace DonationService.Address.Request;

public class GetAddressByIdRequest: IRequest<AddressDto>
{
    public int AddressId { get; set; }
}
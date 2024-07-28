using MediatR;

namespace DonationService.Features.Address.Request;

public class GetAddressByIdRequest : IRequest<AddressDto>
{
    public int AddressId { get; set; }
}
using MediatR;

namespace DonationService.Features.User.Commands;

public class UpdateUserCommand : IRequest<UserDto>
{
    public UserDto userDto { get; set; }
}
using MediatR;

namespace DonationService.User.Commands;

public class UpdateUserCommand : IRequest<UserDto>
{
    public UserDto userDto { get; set; }
}
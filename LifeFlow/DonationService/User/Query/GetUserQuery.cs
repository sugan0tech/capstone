using MediatR;

namespace DonationService.User.Query;

public class GetUserQuery : IRequest<UserDto>
{
    public GetUserQuery(int userId)
    {
        UserId = userId;
    }

    public int UserId { get; init; }
}
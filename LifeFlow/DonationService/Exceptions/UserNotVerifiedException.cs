namespace DonationService.Exceptions;

public class UserNotVerifiedException : Exception
{
    public UserNotVerifiedException(string? message) : base(message)
    {
    }
}
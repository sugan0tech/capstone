namespace DonationService.Exceptions;

public class OutOfServiceException: Exception
{
    public OutOfServiceException()
    {
    }

    public OutOfServiceException(string? message) : base(message)
    {
    }
}
namespace DonationService.Exceptions;

public class InvalidUpdateOperationException: Exception
{
    public InvalidUpdateOperationException()
    {
    }

    public InvalidUpdateOperationException(string? message) : base(message)
    {
    }
}
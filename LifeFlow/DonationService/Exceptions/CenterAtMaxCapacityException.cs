namespace DonationService.Exceptions;

public class CenterAtMaxCapacityException : Exception
{
    public CenterAtMaxCapacityException()
    {
    }

    public CenterAtMaxCapacityException(string? message) : base(message)
    {
    }
}
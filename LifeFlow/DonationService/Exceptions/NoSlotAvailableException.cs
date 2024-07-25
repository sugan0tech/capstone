namespace DonationService.Exceptions;

public class NoSlotAvailableException: Exception
{
    public NoSlotAvailableException()
    {
    }

    public NoSlotAvailableException(string? message) : base(message)
    {
    }
}
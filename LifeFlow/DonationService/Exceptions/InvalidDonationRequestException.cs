namespace DonationService.Exceptions;

public class InvalidDonationRequestException: Exception
{
    public InvalidDonationRequestException()
    {
    }

    public InvalidDonationRequestException(string? message) : base(message)
    {
    }
}
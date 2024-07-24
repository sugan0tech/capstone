namespace DonationService.Exceptions;

public class AlreadyExistingEntityException : Exception
{
    public AlreadyExistingEntityException(string? message) : base(message)
    {
    }
}
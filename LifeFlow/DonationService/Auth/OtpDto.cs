namespace DonationService.Auth;

public record OtpDto
{
    public string Email { get; set; }
    public string Otp { get; set; }
    
}
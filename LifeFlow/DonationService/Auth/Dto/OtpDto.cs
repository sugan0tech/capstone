namespace DonationService.Auth.Dto;

public record OtpDto
{
    public string Email { get; set; }
    public string Otp { get; set; }
}
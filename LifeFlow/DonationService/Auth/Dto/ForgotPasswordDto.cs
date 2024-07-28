using System.ComponentModel.DataAnnotations;

namespace DonationService.Auth.Dto;

public record ForgotPasswordDto
{
    [Required]
    [RegularExpression(@"^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$")]
    [MaxLength(256)]
    public string Email { get; init; }
}
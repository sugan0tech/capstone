#nullable disable
using System.ComponentModel.DataAnnotations;
using DonationService.Commons.Enums;

namespace DonationService.User;

public record RegisterDTO
{
    [Required]
    [RegularExpression(@"^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$")]
    [MaxLength(256)]
    public required string Email { get; init; }

    [MaxLength(50)] public required string Name { get; init; }

    [Required]
    [MaxLength(14, ErrorMessage = "Phone number must be of 14 numbers")]
    public string PhoneNumber { get; init; }

    public required string Role { get; init; }

    public int AddressId { get; init; }

    public required string Password { get; init; }
}
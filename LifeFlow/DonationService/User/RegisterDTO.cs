#nullable disable
using System.ComponentModel.DataAnnotations;

namespace DonationService.User;

public record RegisterDTO
{
    [Required]
    [RegularExpression(@"^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$")]
    [MaxLength(256)]
    public string Email { get; init; }

    [Required] [MaxLength(50)] public string Name { get; init; }

    [Required]
    [MaxLength(10, ErrorMessage = "Phone number must be of 10 numbers")]
    public string PhoneNumber { get; init; }

    [Required] public int AddressId { get; init; }

    [Required] public string Password { get; init; }
}
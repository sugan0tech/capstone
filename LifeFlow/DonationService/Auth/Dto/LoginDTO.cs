#nullable disable
using System.ComponentModel.DataAnnotations;

namespace DonationService.Auth.Dto;

public record LoginDTO
{
    [Required]
    [RegularExpression(@"^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$")]
    [MaxLength(256)]
    public string Email { get; init; }

    [Required] public string Password { get; init; }
    public bool staySigned { get; set; } = false;
}
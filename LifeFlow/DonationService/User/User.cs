using System.ComponentModel.DataAnnotations;
using DonationService.Commons;
using DonationService.Commons.Enums;
using Microsoft.EntityFrameworkCore;

namespace DonationService.User;

[Index(nameof(Email), Name = "Email_Ind", IsUnique = true)]
public class User : BaseEntity
{
    [RegularExpression(@"^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$")]
    [MaxLength(256)]
    public required string Email { get; set; }

    [MaxLength(100)] public required string FirstName { get; set; }
    [MaxLength(100)] public required string LastName { get; set; }

    [MaxLength(14, ErrorMessage = "Phone number must be of 14 numbers")]
    public string? PhoneNumber { get; set; }

    public bool IsVerified { get; set; }
    public required byte[] Password { get; set; }
    public required byte[] HashKey { get; set; }
    public int LoginAttempts { get; set; }

    [Required]
    public Role Role { get; set; }
}
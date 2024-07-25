using System.Diagnostics.CodeAnalysis;

namespace DonationService.User;

[ExcludeFromCodeCoverage]
public record AuthReturnDto
{
    public required string AccessToken { get; init; }
    public required string RefreshToken { get; init; }
    public UserDto User { get; set; }
}
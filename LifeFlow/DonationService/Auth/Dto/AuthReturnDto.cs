using System.Diagnostics.CodeAnalysis;
using DonationService.Features.User;

namespace DonationService.Auth.Dto;

[ExcludeFromCodeCoverage]
public record AuthReturnDto
{
    public required string AccessToken { get; init; }
    public required string RefreshToken { get; init; }
    public UserDto User { get; set; }
}
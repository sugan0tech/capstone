﻿namespace DonationService.Auth.Dto;

public record ResetPasswordDto
{
    public required string Email { get; init; }
    public required string Password { get; init; }
    public required string NewPassword { get; init; }
}
﻿using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Amazon.SecretsManager;
using Amazon.SecretsManager.Model;
using DonationService.Auth.Dto;
using DonationService.Exceptions;
using DonationService.Features.User;
using Microsoft.IdentityModel.Tokens;

namespace DonationService.Auth;

public class TokenService : ITokenService
{
    private readonly SymmetricSecurityKey _key;

    /// <inheritdoc />
    public TokenService(IConfiguration configuration, IAmazonSecretsManager secretsManager)
    {
        // Fetch the secret from AWS Secrets Manager
        string secretName = "LifeFlowSecrets";
        var request = new GetSecretValueRequest
        {
            SecretId = secretName,
            VersionStage = "AWSCURRENT"
        };

        GetSecretValueResponse response;
        try
        {
            response = secretsManager.GetSecretValueAsync(request).Result;
        }
        catch (Exception e)
        {
            throw new Exception("Failed to retrieve secret from AWS Secrets Manager", e);
        }

        string secretString = response.SecretString;
        var secretData = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(secretString);
        var secretKey = secretData.ContainsKey("TokenKey") ? secretData["TokenKey"] : null;

        if (secretKey == null)
            throw new NoSecretKeyFoundException("No Token generation Secret key found for this Environment");

        _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
    }

    /// <inheritdoc />
    public string GenerateToken(UserDto user, DateTime expiration)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Role, user.Role)
        };
        var credentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256);
        var myToken = new JwtSecurityToken(null, null, claims, expires: expiration, signingCredentials: credentials);
        var token = new JwtSecurityTokenHandler().WriteToken(myToken);
        return token;
    }

    /// <inheritdoc />
    public string GenerateAccessToken(UserDto user)
    {
        return GenerateToken(user, DateTime.Now.AddMinutes(1)); // Short-lived access token
    }

    /// <inheritdoc />
    public string GenerateRefreshToken(UserDto user, bool shortLived)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Role, "RefreshToken")
        };
        var credentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256);
        var myToken = new JwtSecurityToken(null, null, claims,
            expires: shortLived ? DateTime.Now.AddHours(6) : DateTime.Now.AddMonths(6),
            signingCredentials: credentials);
        var token = new JwtSecurityTokenHandler().WriteToken(myToken);
        return token;
    }

    /// <inheritdoc />
    public AuthReturnDto GenerateTokens(UserDto user, bool shortLived)
    {
        var accessToken = GenerateToken(user, DateTime.Now.AddMinutes(300)); // Short-lived access token
        var refreshToken = GenerateRefreshToken(user, shortLived); // Long-lived refresh token
        return new AuthReturnDto { AccessToken = accessToken, RefreshToken = refreshToken };
    }

    /// <inheritdoc />
    public PayloadDto GetPayload(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = _key,
            ValidateIssuer = false,
            ValidateAudience = false
        };
        tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);
        var jwtToken = (JwtSecurityToken)validatedToken;
        var claims = jwtToken.Claims;
        var enumerable = claims as Claim[] ?? claims.ToArray();
        var payload = new PayloadDto
        (
            int.Parse(enumerable.First(x => x.Type == ClaimTypes.Name).Value),
            enumerable.First(x => x.Type == ClaimTypes.Email).Value,
            enumerable.First(x => x.Type == ClaimTypes.Role).Value
        );

        return payload;
    }
}

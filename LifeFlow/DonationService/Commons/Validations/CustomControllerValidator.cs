using System.Security.Claims;
using DonationService.Exceptions;
using DonationService.User;

namespace DonationService.Commons.Validations;

/// <summary>
/// Service provides validations with user token and api parameter, else throws respective exceptions.
/// </summary>
/// <param name="userService"></param>
public class CustomControllerValidator(IUserService userService)
{
    /// <summary>
    ///  Validates parameter User id with logged user privilege
    /// </summary>
    /// <param name="claims"></param>
    /// <param name="parameterUserId"></param>
    /// <exception cref="AuthenticationException"></exception>
    public void ValidateUserPrivilege(IEnumerable<Claim> claims, int parameterUserId)
    {
        var enumerable = claims as Claim[] ?? claims.ToArray();
        var usrId = enumerable.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
        var role = enumerable.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
        var email = enumerable.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        if (role is "RefreshToken")
            throw new AuthenticationException($"Using Refresh Token type is prohibitted");
        if (role is "Admin")
            return;
        if (usrId != null && parameterUserId.Equals(int.Parse(usrId)))
            return;

        throw new AuthenticationException($"You {email} dont have permission for this action");
    }

    /// <summary>
    ///  Validate User.
    /// </summary>
    /// <param name="claims"></param>
    /// <param name="ids"></param>
    /// <exception cref="AuthenticationException"></exception>
    public void ValidateUserPrivilege(IEnumerable<Claim> claims, (int, int) ids)
    {
        var enumerable = claims as Claim[] ?? claims.ToArray();
        var usrId = enumerable.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
        var role = enumerable.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
        var email = enumerable.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        if (role is "Admin")
            return;
        if (usrId != null && new[] { ids.Item1, ids.Item2 }.Contains(int.Parse(usrId)))
            return;

        throw new AuthenticationException($"You {email} dont have permission for this action");
    }

    /// <summary>
    ///  Validate User.
    /// </summary>
    /// <param name="claims"></param>
    /// <exception cref="AuthenticationException"></exception>
    public int ValidateAndGetUserId(IEnumerable<Claim> claims)
    {
        var enumerable = claims as Claim[] ?? claims.ToArray();
        var usrId = enumerable.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
        var role = enumerable.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
        if (role is "RefreshToken")
            throw new AuthenticationException($"Using Refresh Token type is prohibited");
        if (usrId != null)
        {
            var userId = int.Parse(usrId);
            return userId;
        }

        throw new AuthenticationException($"Something fishy with the token, unable to verify at this moment");
    }
}
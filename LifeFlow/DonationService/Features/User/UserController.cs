using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using DonationService.Commons;
using DonationService.Commons.Validations;
using DonationService.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace DonationService.Features.User;

[Route("api/[controller]")]
[ApiController]
[EnableCors("AllowAll")]
[ExcludeFromCodeCoverage]
// [Authorize]
public class UserController(
    IUserService userService,
    CustomControllerValidator validator) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById()
    {
        try
        {
            var user = await userService.GetById(validator.ValidateAndGetUserId(User.Claims));
            return Ok(user);
        }
        catch (KeyNotFoundException e)
        {
            return NotFound(new ErrorModel(StatusCodes.Status404NotFound, e.Message));
        }
    }
    
    [HttpGet("{userId}")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int userId)
    {
        try
        {
            var user = await userService.GetById(userId);
            return Ok(user);
        }
        catch (KeyNotFoundException e)
        {
            return NotFound(new ErrorModel(StatusCodes.Status404NotFound, e.Message));
        }
    }

    [HttpGet("all")]
    [ProducesResponseType(typeof(List<UserDto>), StatusCodes.Status200OK)]
    // [Authorize(Policy = "AdminPolicy")]
    public async Task<IActionResult> GetAll()
    {
        var users = await userService.GetAll();
        return Ok(users);
    }

    [HttpPost]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationResult), StatusCodes.Status400BadRequest)]
    // [Authorize(Policy = "AdminPolicy")]
    public async Task<IActionResult> Add([FromBody] UserDto user)
    {
        var createdUser = await userService.Add(user);
        return StatusCode(StatusCodes.Status201Created, createdUser);
    }

    [HttpPut]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationResult), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update([FromBody] UserDto user)
    {
        try
        {
            validator.ValidateUserPrivilege(User.Claims, user.Id);
            var updatedUser = await userService.Update(user);
            return Ok(updatedUser);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ErrorModel(StatusCodes.Status404NotFound, ex.Message));
        }
    }

    [HttpGet("email/{email}")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByEmail(string email)
    {
        try
        {
            var user = await userService.GetByEmail(email);
            return Ok(user);
        }
        catch (UserNotFoundException ex)
        {
            return NotFound(new ErrorModel(StatusCodes.Status404NotFound, ex.Message));
        }
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> DeleteById(int id)
    {
        try
        {
            validator.ValidateUserPrivilege(User.Claims, id);
            var deletedUser = await userService.DeleteById(id);
            return Ok(deletedUser);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ErrorModel(StatusCodes.Status404NotFound, ex.Message));
        }
        catch (AuthenticationException ex)
        {
            return StatusCode(403, new ErrorModel(StatusCodes.Status403Forbidden, ex.Message));
        }
    }

    [HttpPost("validate/{userId}/{status}")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    // [Authorize(Policy = "AdminPolicy")]
    public async Task<IActionResult> Validate(int userId, bool status)
    {
        try
        {
            var user = await userService.Validate(userId, status);
            return Ok(user);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ErrorModel(StatusCodes.Status404NotFound, ex.Message));
        }
    }
}
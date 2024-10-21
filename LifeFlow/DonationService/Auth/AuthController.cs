﻿using System.ComponentModel.DataAnnotations;
using DonationService.Auth.Dto;
using DonationService.Commons;
using DonationService.Exceptions;
using DonationService.Features.User;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DonationService.Auth;

[ApiController]
[Route("api/[controller]")]
[EnableCors("AllowAll")]
public class AuthController(IAuthService authService, ILogger<AuthController> logger) : ControllerBase
{
    [HttpGet("health")]
    [ProducesResponseType(typeof(Ok), StatusCodes.Status200OK)]
    public ActionResult Health()
    {
            return Ok();
    }
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthReturnDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ValidationResult), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> Login([FromBody] LoginDTO loginDto)
    {
        try
        {
            var loginReturnDto = await authService.Login(loginDto);
            logger.LogInformation(loginDto.Email);
            logger.LogCritical(loginDto.Email);
            return Ok(loginReturnDto);
        }
        catch (UserNotVerifiedException e)
        {
            return Unauthorized(new ErrorModel(401, e.Message));
        }
        catch (UserNotFoundException e)
        {
            return NotFound(new ErrorModel(404, e.Message));
        }
        catch (AuthenticationException e)
        {
            return Unauthorized(new ErrorModel(401, e.Message));
        }
    }

    [HttpPost("forgot-password")]
    [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> ForgotPassword([FromBody] ForgotPasswordDto forgotPasswordDto)
    {
        try
        {
            await authService.ForgotPassword(forgotPasswordDto.Email);
            return Ok();
        }
        catch (UserNotFoundException e)
        {
            return NotFound(new ErrorModel(404, e.Message));
        }
        catch (Exception e)
        {
            return BadRequest(new ErrorModel(400, e.Message));
        }
    }

    [HttpPost("logout")]
    [ProducesResponseType(typeof(Ok), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> Logout()
    {
        try
        {
            if (Request.Headers.TryGetValue("Authorization", out var authHeader))
            {
                var token = authHeader.ToString().Split(' ').Last();
                await authService.Logout(token);
                return Ok();
            }

            return BadRequest(new ErrorModel(400, "Authorization header not found."));
        }
        catch (AuthenticationException e)
        {
            return BadRequest(new ErrorModel(400, e.Message));
        }
    }

    [HttpGet("access-token")]
    [ProducesResponseType(typeof(AuthReturnDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetAccessToken()
    {
        try
        {
            if (Request.Headers.TryGetValue("Authorization", out var authHeader))
            {
                var token = authHeader.ToString().Split(' ').Last();
                var dto = await authService.GetAccessToken(token);
                return Ok(dto);
            }

            return BadRequest(new ErrorModel(400, "Authorization header not found."));
        }
        catch (UserNotFoundException e)
        {
            return NotFound(new ErrorModel(404, e.Message));
        }
        catch (AuthenticationException e)
        {
            return Unauthorized(new ErrorModel(401, e.Message));
        }
    }

    [HttpPost("register")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Register([FromBody] RegisterDTO registerDto)
    {
        try
        {
            var user = await authService.Register(registerDto);
            return Ok(user);
        }
        catch (DbUpdateException e)
        {
            var message = e.Message;
            if (e.InnerException != null)
                message = e.InnerException.Message;

            return BadRequest(new ErrorModel(400, message));
        }
        catch (UserNotVerifiedException e)
        {
            return Unauthorized(new ErrorModel(401, e.Message));
        }
        catch (AuthenticationException e)
        {
            return Unauthorized(new ErrorModel(401, e.Message));
        }
    }

    [HttpPost("verify-otp")]
    [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> VerifyOtp([FromBody] OtpDto otp)
    {
        try
        {
            var success = await authService.VerifyUserByOtp(otp.Email, otp.Otp);
            if (success)
                return Ok(new { Success = success });
            return BadRequest(new ErrorModel(400, "Invalid Wrong OTP"));
        }
        catch (UserNotVerifiedException e)
        {
            return Unauthorized(new ErrorModel(401, e.Message));
        }
        catch (AuthenticationException e)
        {
            return Unauthorized(new ErrorModel(401, e.Message));
        }
    }

    [HttpPost("ResetPassword")]
    [ProducesResponseType(typeof(AuthReturnDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
    {
        try
        {
            var dto = await authService.ResetPassword(resetPasswordDto);
            return Ok(dto);
        }
        catch (UserNotVerifiedException e)
        {
            return Unauthorized(new ErrorModel(401, e.Message));
        }
        catch (UserNotFoundException e)
        {
            return NotFound(new ErrorModel(404, e.Message));
        }
        catch (AuthenticationException e)
        {
            return Unauthorized(new ErrorModel(401, e.Message));
        }
    }
}
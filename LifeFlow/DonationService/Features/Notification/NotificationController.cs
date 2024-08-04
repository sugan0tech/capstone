using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using DonationService.Commons;
using DonationService.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using WatchDog;

namespace DonationService.Features.Notification;

[Route("api/[controller]")]
[ApiController]
[EnableCors("AllowAll")]
[ExcludeFromCodeCoverage]
[Authorize]
public class NotificationController(NotificationService notificationService) : ControllerBase
{
    /// <summary>
    ///     Sends a notification.
    /// </summary>
    /// <param name="notification">The notification details.</param>
    /// <returns>Status of the notification send action.</returns>
    [HttpPost("send")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> SendNotification([FromBody] NotificationDto notification)
    {
        try
        {
            await notificationService.SendNotification(notification);
            return Ok();
        }
        catch (Exception ex)
        {
            WatchLogger.LogError(ex.Message);
            return BadRequest(new ErrorModel(StatusCodes.Status400BadRequest, ex.Message));
        }
    }

    /// <summary>
    ///     Checks pending notifications for a receiver.
    /// </summary>
    /// <param name="receiverId">The receiver ID.</param>
    /// <returns>Status of the check action.</returns>
    [HttpGet("check-pending/{receiverId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CheckPendingNotifications(int receiverId)
    {
        try
        {
            await notificationService.CheckPendingNotifications(receiverId);
            return Ok();
        }
        catch (Exception ex)
        {
            WatchLogger.LogError(ex.Message);
            return BadRequest(new ErrorModel(StatusCodes.Status400BadRequest, ex.Message));
        }
    }

    /// <summary>
    ///     Gets pending notifications for a receiver.
    /// </summary>
    /// <param name="receiverId">The receiver ID.</param>
    /// <returns>List of pending notifications.</returns>
    [HttpGet("pending/{receiverId}")]
    [ProducesResponseType(typeof(List<NotificationDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetPendingNotifications(int receiverId)
    {
        try
        {
            var pendingNotifications = await notificationService.GetPendingNotifications(receiverId);
            return Ok(pendingNotifications);
        }
        catch (Exception ex)
        {
            WatchLogger.LogError(ex.Message);
            return BadRequest(new ErrorModel(StatusCodes.Status400BadRequest, ex.Message));
        }
    }

    /// <summary>
    ///     Marks a notification as sent.
    /// </summary>
    /// <param name="notificationId">The notification ID.</param>
    /// <returns>Status of the mark action.</returns>
    [HttpPut("mark-sent/{notificationId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> MarkNotificationsAsSent(int notificationId)
    {
        try
        {
            await notificationService.MarkNotificationsAsSent(notificationId);
            return Ok();
        }
        catch (Exception ex)
        {
            WatchLogger.LogError(ex.Message);
            return BadRequest(new ErrorModel(StatusCodes.Status400BadRequest, ex.Message));
        }
    }

    /// <summary>
    ///     Marks a notification as read.
    /// </summary>
    /// <param name="notificationId">The notification ID.</param>
    /// <returns>Status of the mark action.</returns>
    [HttpPut("mark-read/{notificationId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> MarkAsRead(int notificationId)
    {
        try
        {
            await notificationService.MarkAsRead(notificationId);
            return Ok();
        }
        catch (Exception ex)
        {
            WatchLogger.LogError(ex.Message);
            return BadRequest(new ErrorModel(StatusCodes.Status400BadRequest, ex.Message));
        }
    }

    /// <summary>
    ///     Gets a notification by its ID.
    /// </summary>
    /// <param name="id">The notification ID.</param>
    /// <returns>The notification details.</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(NotificationDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var notification = await notificationService.GetById(id);
            return Ok(notification);
        }
        catch (KeyNotFoundException ex)
        {
            WatchLogger.LogError(ex.Message);
            return NotFound(new ErrorModel(StatusCodes.Status404NotFound, ex.Message));
        }
    }

    /// <summary>
    ///     Gets all notifications.
    /// </summary>
    /// <returns>A list of notifications.</returns>
    [HttpGet("all")]
    [ProducesResponseType(typeof(List<NotificationDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var notifications = await notificationService.GetAll();
        return Ok(notifications);
    }

    /// <summary>
    ///     Adds a new notification.
    /// </summary>
    /// <param name="notificationDto">The notification details.</param>
    /// <returns>The added notification details.</returns>
    [HttpPost]
    [ProducesResponseType(typeof(NotificationDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationResult), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Add([FromBody] NotificationDto notificationDto)
    {
        try
        {
            var createdNotification = await notificationService.Add(notificationDto);
            return StatusCode(StatusCodes.Status201Created, createdNotification);
        }
        catch (DuplicateRequestException ex)
        {
            return BadRequest(new ErrorModel(StatusCodes.Status400BadRequest, ex.Message));
        }
        catch (Exception ex)
        {
            return BadRequest(new ErrorModel(StatusCodes.Status400BadRequest, ex.Message));
        }
    }

    /// <summary>
    ///     Deletes a notification by its ID.
    /// </summary>
    /// <param name="id">The notification ID to delete.</param>
    /// <returns>The deleted notification details.</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(typeof(NotificationDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteById(int id)
    {
        try
        {
            var notification = await notificationService.DeleteById(id);
            return Ok(notification);
        }
        catch (KeyNotFoundException ex)
        {
            WatchLogger.LogError(ex.Message);
            return NotFound(new ErrorModel(StatusCodes.Status404NotFound, ex.Message));
        }
    }
}
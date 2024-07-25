using System.ComponentModel.DataAnnotations;
using DonationService.Commons;
using DonationService.Commons.Validations;
using DonationService.DonationSlot;
using DonationService.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using WatchDog;

namespace DonationService.BloodCenter;

[Route("api/[controller]")]
[ApiController]
[EnableCors("AllowAll")]
// [Authorize]
public class BloodCenterController(
    BloodCenterService bloodCenterService,
    CustomControllerValidator validator) : ControllerBase
{
    /// <summary>
    /// Adds a new blood center.
    /// </summary>
    /// <param name="bloodCenterDto">The details of the blood center to add.</param>
    /// <returns>The added blood center details.</returns>
    [HttpPost]
    [ProducesResponseType(typeof(BloodCenterDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationResult), StatusCodes.Status400BadRequest)]
    [Authorize(Policy = "AdminPolicy")]
    public async Task<IActionResult> Add([FromBody] BloodCenterDto bloodCenterDto)
    {
        var createdBloodCenter = await bloodCenterService.Add(bloodCenterDto);
        return StatusCode(StatusCodes.Status201Created, createdBloodCenter);
    }

    /// <summary>
    /// Deletes a blood center by its ID.
    /// </summary>
    /// <param name="id">The ID of the blood center to delete.</param>
    /// <returns>The deleted blood center details.</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(typeof(BloodCenterDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> DeleteById(int id)
    {
        try
        {
            var deletedBloodCenter = await bloodCenterService.DeleteById(id);
            return Ok(deletedBloodCenter);
        }
        catch (KeyNotFoundException ex)
        {
            WatchLogger.LogError(ex.Message);
            return NotFound(new ErrorModel(StatusCodes.Status404NotFound, ex.Message));
        }
        catch (AuthenticationException ex)
        {
            WatchLogger.LogError(ex.Message);
            return StatusCode(StatusCodes.Status403Forbidden,
                new ErrorModel(StatusCodes.Status403Forbidden, ex.Message));
        }
    }

    /// <summary>
    /// Updates an existing blood center.
    /// </summary>
    /// <param name="bloodCenterDto">The details of the blood center to update.</param>
    /// <returns>The updated blood center details.</returns>
    [HttpPut]
    [ProducesResponseType(typeof(BloodCenterDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationResult), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update([FromBody] BloodCenterDto bloodCenterDto)
    {
        try
        {
            var updatedBloodCenter = await bloodCenterService.Update(bloodCenterDto);
            return Ok(updatedBloodCenter);
        }
        catch (KeyNotFoundException ex)
        {
            WatchLogger.LogError(ex.Message);
            return NotFound(new ErrorModel(StatusCodes.Status404NotFound, ex.Message));
        }
    }

    /// <summary>
    /// Gets a blood center by its ID.
    /// </summary>
    /// <param name="id">The ID of the blood center.</param>
    /// <returns>The blood center details.</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(BloodCenterDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var bloodCenter = await bloodCenterService.GetById(id);
            return Ok(bloodCenter);
        }
        catch (KeyNotFoundException ex)
        {
            WatchLogger.LogError(ex.Message);
            return NotFound(new ErrorModel(StatusCodes.Status404NotFound, ex.Message));
        }
    }

    /// <summary>
    /// Gets all blood centers.
    /// </summary>
    /// <returns>A list of blood centers.</returns>
    [HttpGet("all")]
    [ProducesResponseType(typeof(List<BloodCenterDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var bloodCenters = await bloodCenterService.GetAll();
        return Ok(bloodCenters);
    }


    /// <summary>
    /// Gets nearby blood centers within 50 km of the given location.
    /// </summary>
    /// <param name="latitude">The latitude of the location.</param>
    /// <param name="longitude">The longitude of the location.</param>
    /// <returns>A list of nearby blood centers.</returns>
    [HttpGet("nearby")]
    [ProducesResponseType(typeof(List<BloodCenterDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetNearByCenters(double latitude, double longitude)
    {
        try
        {
            var nearbyCenters = await bloodCenterService.GetNearByCenters(latitude, longitude);
            return Ok(nearbyCenters);
        }
        catch (Exception ex)
        {
            WatchLogger.LogError(ex.Message);
            return BadRequest(new ErrorModel(StatusCodes.Status400BadRequest, ex.Message));
        }
    }

    /// <summary>
    /// Gets blood centers by name.
    /// </summary>
    /// <param name="name">The name of the blood center.</param>
    /// <returns>A list of blood centers.</returns>
    [HttpGet("name/{name}")]
    [ProducesResponseType(typeof(List<BloodCenterDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetCenterByName(string name)
    {
        try
        {
            var centers = await bloodCenterService.GetCenterByName(name);
            return Ok(centers);
        }
        catch (Exception ex)
        {
            WatchLogger.LogError(ex.Message);
            return BadRequest(new ErrorModel(StatusCodes.Status400BadRequest, ex.Message));
        }
    }

    /// <summary>
    /// Books an appointment at a blood center.
    /// </summary>
    /// <param name="centerName">The name of the blood center.</param>
    /// <param name="donorId"></param>
    /// <returns>The booked donation slot.</returns>
    [HttpPost("{centerName}/book/{donorId}")]
    [ProducesResponseType(typeof(DonationSlotDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> BookAppointment(string centerName, int donorId)
    {
        try
        {
            var bookedSlot = await bloodCenterService.BookAppointment(centerName, donorId);
            return StatusCode(StatusCodes.Status201Created, bookedSlot);
        }
        catch (NoSlotAvailableException ex)
        {
            WatchLogger.LogError(ex.Message);
            return NotFound(new ErrorModel(StatusCodes.Status404NotFound, ex.Message));
        }
        catch (KeyNotFoundException ex)
        {
            WatchLogger.LogError(ex.Message);
            return NotFound(new ErrorModel(StatusCodes.Status404NotFound, ex.Message));
        }
        catch (InvalidOperationException ex)
        {
            WatchLogger.LogError(ex.Message);
            return BadRequest(new ErrorModel(StatusCodes.Status400BadRequest, ex.Message));
        }
        catch (Exception ex)
        {
            WatchLogger.LogError(ex.Message);
            return StatusCode(StatusCodes.Status500InternalServerError,
                new ErrorModel(StatusCodes.Status500InternalServerError, ex.Message));
        }
    }

    /// <summary>
    /// Gets pending donation slots at a blood center.
    /// </summary>
    /// <param name="centerName">The name of the blood center.</param>
    /// <returns>A list of pending donation slots.</returns>
    [HttpGet("{centerName}/pendingslots")]
    [ProducesResponseType(typeof(List<DonationSlotDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetPendingSlots(string centerName)
    {
        try
        {
            var pendingSlots = await bloodCenterService.GetPendingSlots(centerName);
            return Ok(pendingSlots);
        }
        catch (KeyNotFoundException ex)
        {
            WatchLogger.LogError(ex.Message);
            return NotFound(new ErrorModel(StatusCodes.Status404NotFound, ex.Message));
        }
        catch (Exception ex)
        {
            WatchLogger.LogError(ex.Message);
            return StatusCode(StatusCodes.Status500InternalServerError,
                new ErrorModel(StatusCodes.Status500InternalServerError, ex.Message));
        }
    }

    /// <summary>
    /// Gets completed donation slots at a blood center.
    /// </summary>
    /// <param name="centerName">The name of the blood center.</param>
    /// <returns>A list of completed donation slots.</returns>
    [HttpGet("{centerName}/completedslots")]
    [ProducesResponseType(typeof(List<DonationSlotDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetCompletedSlots(string centerName)
    {
        try
        {
            var completedSlots = await bloodCenterService.GetCompletedSlots(centerName);
            return Ok(completedSlots);
        }
        catch (KeyNotFoundException ex)
        {
            WatchLogger.LogError(ex.Message);
            return NotFound(new ErrorModel(StatusCodes.Status404NotFound, ex.Message));
        }
        catch (Exception ex)
        {
            WatchLogger.LogError(ex.Message);
            return StatusCode(StatusCodes.Status500InternalServerError,
                new ErrorModel(StatusCodes.Status500InternalServerError, ex.Message));
        }
    }
}
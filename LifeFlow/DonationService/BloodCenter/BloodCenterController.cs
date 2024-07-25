using System.ComponentModel.DataAnnotations;
using DonationService.Commons;
using DonationService.Commons.Validations;
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
    IBaseService<BloodCenter, BloodCenterDto> bloodCenterService,
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
}
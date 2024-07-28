using System.ComponentModel.DataAnnotations;
using DonationService.Commons;
using DonationService.Commons.Enums;
using DonationService.Commons.Validations;
using DonationService.Exceptions;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using WatchDog;

namespace DonationService.Features.Donor;

[Route("api/[controller]")]
[ApiController]
[EnableCors("AllowAll")]
// [Authorize]
public class DonorController(
    IDonorService donorService,
    CustomControllerValidator validator) : ControllerBase
{
    /// <summary>
    ///     Gets a donor by their user ID.
    /// </summary>
    /// <param name="userId">The ID of the user.</param>
    /// <returns>The donor details.</returns>
    [HttpGet("{userId}")]
    [ProducesResponseType(typeof(DonorDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByUserId(int userId)
    {
        try
        {
            validator.ValidateUserPrivilege(User.Claims, userId);
            var donor = await donorService.GetByUserId(userId);
            return Ok(donor);
        }
        catch (KeyNotFoundException e)
        {
            WatchLogger.LogError(e.Message);
            return NotFound(new ErrorModel(StatusCodes.Status404NotFound, e.Message));
        }
        catch (AuthenticationException e)
        {
            WatchLogger.LogError(e.Message);
            return StatusCode(403, new ErrorModel(StatusCodes.Status403Forbidden, "You are not this user"));
        }
    }

    /// <summary>
    ///     Gets a donor by their ID.
    /// </summary>
    /// <param name="id">The ID of the donor.</param>
    /// <returns>The donor details.</returns>
    [HttpGet("id/{id}")]
    [ProducesResponseType(typeof(DonorDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var donor = await donorService.GetById(id);
            return Ok(donor);
        }
        catch (KeyNotFoundException e)
        {
            WatchLogger.LogError(e.Message);
            return NotFound(new ErrorModel(StatusCodes.Status404NotFound, e.Message));
        }
    }

    /// <summary>
    ///     Gets all donors.
    /// </summary>
    /// <returns>A list of donors.</returns>
    [HttpGet("all")]
    [ProducesResponseType(typeof(List<DonorDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var donors = await donorService.GetAll();
        return Ok(donors);
    }

    /// <summary>
    ///     Gets donors by location.
    /// </summary>
    /// <param name="lat">Latitude of the location.</param>
    /// <param name="lon">Longitude of the location.</param>
    /// <returns>A list of nearby donors.</returns>
    [HttpGet("location")]
    [ProducesResponseType(typeof(List<DonorFetchDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByLocation(double lat, double lon)
    {
        var donors = await donorService.GetByLocation(lat, lon);
        return Ok(donors);
    }

    /// <summary>
    ///     Gets donors by location and blood type.
    /// </summary>
    /// <param name="lat">Latitude of the location.</param>
    /// <param name="lon">Longitude of the location.</param>
    /// <param name="bloodType">The blood type of the donor.</param>
    /// <param name="subtype">The blood subtype of the donor.</param>
    /// <returns>A list of nearby donors with the specified blood type.</returns>
    [HttpGet("location/bloodType")]
    [ProducesResponseType(typeof(List<DonorFetchDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByLocationAndBloodType(double lat, double lon, string bloodType,
        string subtype)
    {
        var donors = await donorService.GetByLocationAndBloodType(lat, lon, Enum.Parse<AntigenType>(bloodType),
            Enum.Parse<BloodSubtype>(subtype));
        return Ok(donors);
    }

    /// <summary>
    ///     Deletes a donor by their ID.
    /// </summary>
    /// <param name="id">The ID of the donor to delete.</param>
    /// <returns>The deleted donor details.</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(typeof(DonorDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> DeleteById(int id)
    {
        try
        {
            var donor = await donorService.DeleteById(id);
            return Ok(donor);
        }
        catch (KeyNotFoundException e)
        {
            WatchLogger.LogError(e.Message);
            return NotFound(new ErrorModel(StatusCodes.Status404NotFound, e.Message));
        }
        catch (AuthenticationException e)
        {
            WatchLogger.LogError(e.Message);
            return StatusCode(403, new ErrorModel(StatusCodes.Status403Forbidden, e.Message));
        }
    }

    /// <summary>
    ///     Adds a new donor.
    /// </summary>
    /// <param name="donorDto">The details of the donor to add.</param>
    /// <returns>The added donor details.</returns>
    [HttpPost]
    [ProducesResponseType(typeof(DonorDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationResult), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status403Forbidden)]
    // [Authorize(Policy = "Donor")]
    public async Task<IActionResult> Add([FromBody] DonorDto donorDto)
    {
        // var usedId = validator.ValidateAndGetUserId(User.Claims);
        // if (usedId != donorDto.UserId)
        // {
        //     return StatusCode(403,
        //         new ErrorModel(StatusCodes.Status403Forbidden, "You can't make donor profile for another user"));
        // }

        try
        {
            var createdDonor = await donorService.Add(donorDto);
            return StatusCode(StatusCodes.Status201Created, createdDonor);
        }
        catch (DuplicateRequestException e)
        {
            return StatusCode(400, new ErrorModel(StatusCodes.Status400BadRequest, e.Message));
        }
        catch (Exception e)
        {
            return StatusCode(400, new ErrorModel(StatusCodes.Status400BadRequest, e.Message));
        }
    }

    /// <summary>
    ///     Updates an existing donor.
    /// </summary>
    /// <param name="donorDto">The details of the donor to update.</param>
    /// <returns>The updated donor details.</returns>
    [HttpPut]
    [ProducesResponseType(typeof(DonorDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationResult), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update([FromBody] DonorDto donorDto)
    {
        try
        {
            var updatedDonor = await donorService.Update(donorDto);
            return Ok(updatedDonor);
        }
        catch (KeyNotFoundException e)
        {
            WatchLogger.LogError(e.Message);
            return NotFound(new ErrorModel(StatusCodes.Status404NotFound, e.Message));
        }
        catch (InvalidUpdateOperationException e)
        {
            WatchLogger.LogError(e.Message);
            return BadRequest(new ErrorModel(StatusCodes.Status400BadRequest, e.Message));
        }
    }

    [HttpGet("history/{donorId}")]
    [ProducesResponseType(typeof(DonorDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationResult), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> History(int donorId)
    {
        try
        {
            var slots = await donorService.GetCompletedSlotsByDonor(donorId);
            return Ok(slots);
        }
        catch (KeyNotFoundException e)
        {
            WatchLogger.LogError(e.Message);
            return NotFound(new ErrorModel(StatusCodes.Status404NotFound, e.Message));
        }
        catch (InvalidUpdateOperationException e)
        {
            WatchLogger.LogError(e.Message);
            return BadRequest(new ErrorModel(StatusCodes.Status400BadRequest, e.Message));
        }
    }

    [HttpGet("current/{donorId}")]
    [ProducesResponseType(typeof(DonorDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationResult), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetCurrentSlot(int donorId)
    {
        try
        {
            var slot = await donorService.GetCurrentSlotsByDonor(donorId);
            return Ok(slot);
        }
        catch (KeyNotFoundException e)
        {
            WatchLogger.LogError(e.Message);
            return NotFound(new ErrorModel(StatusCodes.Status404NotFound, e.Message));
        }
        catch (InvalidUpdateOperationException e)
        {
            WatchLogger.LogError(e.Message);
            return BadRequest(new ErrorModel(StatusCodes.Status400BadRequest, e.Message));
        }
    }
}
using System.ComponentModel.DataAnnotations;
using DonationService.Commons;
using DonationService.Commons.Validations;
using DonationService.Exceptions;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using WatchDog;

namespace DonationService.Features.DonationSlot;

[Route("api/[controller]")]
[ApiController]
[EnableCors("AllowAll")]
// [Authorize]
public class DonationSlotController(
    DonationSlotService donationSlotService,
    CustomControllerValidator validator) : ControllerBase
{
    /// <summary>
    ///     Adds a new donation slot.
    /// </summary>
    /// <param name="donationSlotDto">The details of the donation slot to add.</param>
    /// <returns>The added donation slot details.</returns>
    [HttpPost]
    [ProducesResponseType(typeof(DonationSlotDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationResult), StatusCodes.Status400BadRequest)]
    // [Authorize(Policy = "AdminPolicy")]
    public async Task<IActionResult> Add([FromBody] DonationSlotDto donationSlotDto)
    {
        var createdDonationSlot = await donationSlotService.Add(donationSlotDto);
        return StatusCode(StatusCodes.Status201Created, createdDonationSlot);
    }

    /// <summary>
    ///     Deletes a donation slot by its ID.
    /// </summary>
    /// <param name="id">The ID of the donation slot to delete.</param>
    /// <returns>The deleted donation slot details.</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(typeof(DonationSlotDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> DeleteById(int id)
    {
        try
        {
            var deletedDonationSlot = await donationSlotService.DeleteById(id);
            return Ok(deletedDonationSlot);
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
    ///     Updates an existing donation slot.
    /// </summary>
    /// <param name="dsdto">DonationSlotDto.</param>
    /// <returns>The updated donation slot details.</returns>
    [HttpPut]
    [ProducesResponseType(typeof(DonationSlotDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationResult), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update([FromBody] DonationSlotDto dsdto)
    {
        try
        {
            var donationSlot = await donationSlotService.GetById(dsdto.Id);
            // donationSlot.SlotTime = dsdto.SlotTime;
            donationSlot.SlotStatus = dsdto.SlotStatus;

            var updatedDonationSlot = await donationSlotService.Update(donationSlot);
            return Ok(updatedDonationSlot);
        }
        catch (KeyNotFoundException ex)
        {
            WatchLogger.LogError(ex.Message);
            return NotFound(new ErrorModel(StatusCodes.Status404NotFound, ex.Message));
        }
    }

    /// <summary>
    ///     Gets a donation slot by its ID.
    /// </summary>
    /// <param name="id">The ID of the donation slot.</param>
    /// <returns>The donation slot details.</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(DonationSlotDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var donationSlot = await donationSlotService.GetById(id);
            return Ok(donationSlot);
        }
        catch (KeyNotFoundException ex)
        {
            WatchLogger.LogError(ex.Message);
            return NotFound(new ErrorModel(StatusCodes.Status404NotFound, ex.Message));
        }
    }

    /// <summary>
    ///     Gets all donation slots.
    /// </summary>
    /// <returns>A list of donation slots.</returns>
    [HttpGet("all/")]
    [ProducesResponseType(typeof(List<DonationSlotDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var donationSlots = await donationSlotService.GetAll();
        return Ok(donationSlots);
    }
    
    /// <summary>
    ///     Gets all donation slots for a center.
    /// </summary>
    /// <returns>A list of donation slots.</returns>
    [HttpGet("all/{centerId}")]
    [ProducesResponseType(typeof(List<DonationSlotDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(int centerId)
    {
        var donationSlots = await donationSlotService.GetAllByCenterId(centerId);
        return Ok(donationSlots);
    }
}
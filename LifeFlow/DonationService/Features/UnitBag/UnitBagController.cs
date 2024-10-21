using System.ComponentModel.DataAnnotations;
using DonationService.Commons;
using DonationService.Commons.Validations;
using DonationService.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace DonationService.Features.UnitBag;

[Route("api/[controller]")]
[ApiController]
[EnableCors("AllowAll")]
[Authorize]
public class UnitBagController(
    UnitBagService unitBagService,
    CustomControllerValidator validator) : ControllerBase
{
    /// <summary>
    ///     Adds a new unit bag.
    /// </summary>
    /// <param name="unitBagDto">The details of the unit bag to add.</param>
    /// <returns>The added unit bag details.</returns>
    [HttpPost]
    [ProducesResponseType(typeof(UnitBagDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationResult), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Add([FromBody] UnitBagDto unitBagDto)
    {
        var createdUnitBag = await unitBagService.Add(unitBagDto);
        return StatusCode(StatusCodes.Status201Created, createdUnitBag);
    }

    /// <summary>
    ///     Deletes a unit bag by its ID.
    /// </summary>
    /// <param name="id">The ID of the unit bag to delete.</param>
    /// <returns>The deleted unit bag details.</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(typeof(UnitBagDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> DeleteById(int id)
    {
        try
        {
            var deletedUnitBag = await unitBagService.DeleteById(id);
            return Ok(deletedUnitBag);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ErrorModel(StatusCodes.Status404NotFound, ex.Message));
        }
        catch (AuthenticationException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden,
                new ErrorModel(StatusCodes.Status403Forbidden, ex.Message));
        }
    }

    /// <summary>
    ///     Updates an existing unit bag.
    /// </summary>
    /// <param name="unitBagDto">The details of the unit bag to update.</param>
    /// <returns>The updated unit bag details.</returns>
    [HttpPut]
    [ProducesResponseType(typeof(UnitBagDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationResult), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update([FromBody] UnitBagDto unitBagDto)
    {
        try
        {
            var updatedUnitBag = await unitBagService.Update(unitBagDto);
            return Ok(updatedUnitBag);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ErrorModel(StatusCodes.Status404NotFound, ex.Message));
        }
    }

    /// <summary>
    ///     Gets a unit bag by its ID.
    /// </summary>
    /// <param name="id">The ID of the unit bag.</param>
    /// <returns>The unit bag details.</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(UnitBagDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var unitBag = await unitBagService.GetById(id);
            return Ok(unitBag);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ErrorModel(StatusCodes.Status404NotFound, ex.Message));
        }
    }

    /// <summary>
    ///     Gets all unit bags.
    /// </summary>
    /// <returns>A list of unit bags.</returns>
    [HttpGet("all")]
    [ProducesResponseType(typeof(List<UnitBagDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var unitBags = await unitBagService.GetAll();
        return Ok(unitBags);
    }

    /// <summary>
    ///     Gets all unit bags.
    /// </summary>
    /// <returns>A list of unit bags.</returns>
    [HttpGet("order/{orderId}")]
    [ProducesResponseType(typeof(List<UnitBagDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllByOrder(int orderId)
    {
        var unitBags = await unitBagService.GetBagsByOrder(orderId);
        return Ok(unitBags);
    }
}
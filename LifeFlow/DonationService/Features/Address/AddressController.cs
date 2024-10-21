﻿using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using DonationService.Commons;
using DonationService.Commons.Validations;
using DonationService.Exceptions;
using DonationService.Features.Address.Command;
using DonationService.Features.Address.Query;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace DonationService.Features.Address;

[ApiController]
[Route("api/[controller]")]
[EnableCors("AllowAll")]
[ExcludeFromCodeCoverage]
// [Authorize]
public class AddressController(
    ILogger<AddressController> logger,
    IAddressCommandHandler<CreateAddressCommand> createAddressHandler,
    IAddressCommandHandler<UpdateAddressCommand> updateAddressHandler,
    IAddressCommandHandler<DeleteAddressCommand> deleteAddressHandler,
    IQueryHandler<GetAddressByIdQuery, AddressDto> getAddressByIdHandler,
    IQueryHandler<GetAllAddressesQuery, List<AddressDto>> getAllAddressesHandler,
    CustomControllerValidator validator)
    : ControllerBase
{
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(AddressDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ValidationResult), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetAddressById(int id)
    {
        try
        {
            var address = await getAddressByIdHandler.Handle(new GetAddressByIdQuery { Id = id });
            return Ok(address);
        }
        catch (KeyNotFoundException e)
        {
            logger.LogError(e.Message);
            return NotFound(new ErrorModel(404, e.Message));
        }
    }

    [HttpGet]
    [ProducesResponseType(typeof(List<AddressDto>), StatusCodes.Status200OK)]
    [Authorize(Policy = "AdminPolicy")]
    public async Task<IActionResult> GetAllAddresses()
    {
        var addresses = await getAllAddressesHandler.Handle(new GetAllAddressesQuery());
        return Ok(addresses);
    }

    [HttpPost]
    [ProducesResponseType(typeof(AddressDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ValidationResult), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AddAddress([FromBody] AddressDto addressDto)
    {
        try
        {
            // validator.ValidateUserPrivilege(User.Claims, addressDto.EntityId);
            logger.LogInformation(addressDto.ToString());
            var createdAddress = await createAddressHandler.Handle(new CreateAddressCommand(addressDto));
            
            return Ok(createdAddress);
        }
        catch (AlreadyExistingEntityException e)
        {
            return BadRequest(new ErrorModel(400, e.Message));
        }
        catch (KeyNotFoundException e)
        {
            return StatusCode(404, new ErrorModel(404, e.Message));
        }
        catch (InvalidEntityTypeException e)
        {
            return BadRequest(new ErrorModel(400, e.Message));
        }
        catch (AuthenticationException e)
        {
            return BadRequest(new ErrorModel(400, e.Message));
        }
    }

    [HttpPut]
    [ProducesResponseType(typeof(AddressDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ValidationResult), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateAddress([FromBody] AddressDto addressDto)
    {
        try
        {
            await updateAddressHandler.Handle(new UpdateAddressCommand(addressDto));
            return Ok();
        }
        catch (KeyNotFoundException ex)
        {
            logger.LogError(ex.Message);
            return NotFound(new ErrorModel(404, ex.Message));
        }
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(typeof(OkResult), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteAddressById(int id)
    {
        try
        {
            await deleteAddressHandler.Handle(new DeleteAddressCommand { Id = id });
            return Ok();
        }
        catch (KeyNotFoundException e)
        {
            logger.LogError(e.Message);
            return NotFound(new ErrorModel(404, e.Message));
        }
    }
}
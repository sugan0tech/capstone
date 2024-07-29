using System.ComponentModel.DataAnnotations;
using DonationService.Commons;
using DonationService.Commons.Validations;
using DonationService.Exceptions;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace DonationService.Features.Orders;

[Route("api/[controller]")]
[ApiController]
[EnableCors("AllowAll")]
public class OrderController(OrderService orderService, CustomControllerValidator validator)
    : ControllerBase
{
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(OrderDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var order = await orderService.GetById(id);
            return Ok(order);
        }
        catch (KeyNotFoundException e)
        {
            return NotFound(new ErrorModel(StatusCodes.Status404NotFound, e.Message));
        }
    }

    [HttpGet("all")]
    [ProducesResponseType(typeof(List<OrderDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var orders = await orderService.GetAll();
        return Ok(orders);
    }

    [HttpPost]
    [ProducesResponseType(typeof(OrderDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationResult), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Add([FromBody] OrderDto order)
    {
        var createdOrder = await orderService.Add(order);
        return StatusCode(StatusCodes.Status201Created, createdOrder);
    }

    [HttpPut]
    [ProducesResponseType(typeof(OrderDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationResult), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update([FromBody] OrderDto order)
    {
        try
        {
            var updatedOrder = await orderService.Update(order);
            return Ok(updatedOrder);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ErrorModel(StatusCodes.Status404NotFound, ex.Message));
        }
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(typeof(OrderDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> DeleteById(int id)
    {
        try
        {
            var deletedOrder = await orderService.DeleteById(id);
            return Ok(deletedOrder);
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
}
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using DonationService.Commons;
using DonationService.Commons.Enums;
using DonationService.Commons.Validations;
using DonationService.Exceptions;
using DonationService.Features.Address.Command;
using DonationService.Features.Orders.Commands;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace DonationService.Features.Orders;

[Route("api/[controller]")]
[ApiController]
[EnableCors("AllowAll")]
[ExcludeFromCodeCoverage]
[Authorize]
public class OrderController(
    OrderService orderService,
    ICommandHandler<UpdateOrderStatusCommand> commandHandler,
    CustomControllerValidator validator)
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

    [HttpGet("Center/{centerName}")]
    [ProducesResponseType(typeof(List<OrderDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCenterOrders(string centerName)
    {
        var orders = await orderService.CenterOrders(centerName);
        return Ok(orders);
    }

    [HttpGet("Client/{clientId}")]
    [ProducesResponseType(typeof(List<OrderDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetClientOrders(int clientId)
    {
        var orders = await orderService.ClientOrders(clientId);
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

    [HttpPost("make")]
    [ProducesResponseType(typeof(OrderDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationResult), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> MakeOrder([FromBody] OrderRequestDto order)
    {
        try
        {
            var createdOrder = await orderService.MakeOrder(order);
            // var createdOrder = await orderService.GetById(18);
            return StatusCode(StatusCodes.Status201Created, createdOrder);
        }
        catch (KeyNotFoundException e)
        {
            Console.WriteLine(e);
            return StatusCode(404,
                new ErrorModel(404, e.Message));
        }
        catch (OutOfServiceException e)
        {
            Console.WriteLine(e);
            return StatusCode(404,
                new ErrorModel(404, e.Message));
        }
        catch (InvalidOperationException e)
        {
            return StatusCode(400,
                new ErrorModel(400, e.Message));
        }
    }

    [HttpPut("{orderId}/{status}")]
    [ProducesResponseType(typeof(OrderDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationResult), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateOrderStatus(int orderId, string status)
    {
        try
        {
            await commandHandler.Handle(new UpdateOrderStatusCommand(orderId, Enum.Parse<OrderStatus>(status)));
            return StatusCode(StatusCodes.Status201Created, orderService.GetById(orderId));
        }
        catch (KeyNotFoundException e)
        {
            Console.WriteLine(e);
            return StatusCode(404,
                new ErrorModel(404, e.Message));
        }
        catch (InvalidOperationException e)
        {
            return StatusCode(400,
                new ErrorModel(400, e.Message));
        }
    }
}
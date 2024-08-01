using System.ComponentModel.DataAnnotations;
using DonationService.Commons;
using DonationService.Commons.Validations;
using DonationService.Exceptions;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace DonationService.Features.Payment;

[Route("api/[controller]")]
[ApiController]
[EnableCors("AllowAll")]
public class PaymentController(PaymentService paymentService, CustomControllerValidator validator)
    : ControllerBase
{
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(PaymentDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var payment = await paymentService.GetById(id);
            return Ok(payment);
        }
        catch (KeyNotFoundException e)
        {
            return NotFound(new ErrorModel(StatusCodes.Status404NotFound, e.Message));
        }
    }

    [HttpGet("all")]
    [ProducesResponseType(typeof(List<PaymentDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var payments = await paymentService.GetAll();
        return Ok(payments);
    }

    [HttpPost]
    [ProducesResponseType(typeof(PaymentDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationResult), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Add([FromBody] PaymentDto payment)
    {
        var createdPayment = await paymentService.Add(payment);
        return StatusCode(StatusCodes.Status201Created, createdPayment);
    }

    [HttpPut]
    [ProducesResponseType(typeof(PaymentDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationResult), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update([FromBody] PaymentDto payment)
    {
        try
        {
            var updatedPayment = await paymentService.Update(payment);
            return Ok(updatedPayment);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ErrorModel(StatusCodes.Status404NotFound, ex.Message));
        }
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(typeof(PaymentDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ErrorModel), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> DeleteById(int id)
    {
        try
        {
            var deletedPayment = await paymentService.DeleteById(id);
            return Ok(deletedPayment);
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
    [ProducesResponseType(typeof(PaymentDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationResult), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> MakePayment([FromBody] MakePaymentDto payment)
    {
        try
        {
            var createdPayment = await paymentService.MakePayment(payment.PaymentId, payment.Amount, payment.Method);
            return StatusCode(StatusCodes.Status201Created, createdPayment);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return StatusCode(400,
                new ErrorModel(400, e.Message));
        }
    }
}
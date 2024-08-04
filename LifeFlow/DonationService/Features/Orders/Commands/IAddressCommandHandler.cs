namespace DonationService.Features.Orders.Commands;

public interface IOrderCommandHandler<TCommand>
{
    Task Handle(TCommand command);
}
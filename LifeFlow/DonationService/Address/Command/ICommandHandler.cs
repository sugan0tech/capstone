namespace DonationService.Address.Command;

public interface ICommandHandler<TCommand>
{
    Task Handle(TCommand command);
}
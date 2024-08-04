using DonationService.Commons;
using DonationService.Entities;
using DonationService.Features.Address;
using DonationService.Features.Address.Command;

namespace DonationService.Features.Orders.Commands;

public class UpdateOrderCommandHandler(IBaseRepo<Order> repo) : IOrderCommandHandler<UpdateOrderStatusCommand>
{
    public async Task Handle(UpdateOrderStatusCommand command)
    {
        var order = await repo.GetById(command.OrderId);
        order.Status = command.status;
        await repo.Update(order);
    }
}
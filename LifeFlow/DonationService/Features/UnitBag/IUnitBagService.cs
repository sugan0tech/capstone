namespace DonationService.Features.UnitBag;

public interface IUnitBagService
{
    public Task<List<UnitBagDto>> GetBagsByOrder(int orderId);
}
using AutoMapper;
using DonationService.Commons;

namespace DonationService.Features.UnitBag;

public class UnitBagService(IBaseRepo<Entities.UnitBag> repo, IMapper mapper)
    : BaseService<Entities.UnitBag, UnitBagDto>(repo, mapper), IUnitBagService
{
    public async Task<List<UnitBagDto>> GetBagsByOrder(int orderId)
    {
        var bags = await GetAll();
        return mapper.Map<List<UnitBagDto>>(bags.FindAll(dto => dto.IsSold && dto.OrderId.Equals(orderId)));
    }
}
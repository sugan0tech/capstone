using AutoMapper;
using DonationService.Commons;

namespace DonationService.Features.UnitBag;

public class UnitBagService(IBaseRepo<Entities.UnitBag> repo, IMapper mapper)
    : BaseService<Entities.UnitBag, UnitBagDto>(repo, mapper);
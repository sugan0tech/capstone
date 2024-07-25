using AutoMapper;
using DonationService.Commons;

namespace DonationService.UnitBag;

public class UnitBagService(IBaseRepo<UnitBag> repo, IMapper mapper) : BaseService<UnitBag, UnitBagDto>(repo, mapper);
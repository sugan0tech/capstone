using DonationService.Commons;

namespace DonationService.Features.UnitBag;

public class UnitBagRepo(DonationServiceContext context) : BaseRepo<Entities.UnitBag>(context);
using DonationService.Commons;

namespace DonationService.UnitBag;

public class UnitBagRepo(DonationServiceContext context): BaseRepo<UnitBag>(context);
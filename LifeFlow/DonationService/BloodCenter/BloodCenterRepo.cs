using DonationService.Commons;

namespace DonationService.BloodCenter;

public class BloodCenterRepo(DonationServiceContext context): BaseRepo<BloodCenter>(context);
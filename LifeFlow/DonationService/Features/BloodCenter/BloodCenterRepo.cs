using DonationService.Commons;

namespace DonationService.Features.BloodCenter;

public class BloodCenterRepo(DonationServiceContext context) : BaseRepo<Entities.BloodCenter>(context);
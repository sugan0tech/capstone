using DonationService.Commons;

namespace DonationService.DonationSlot;

public class DonationSlotRepo(DonationServiceContext context) : BaseRepo<DonationSlot>(context);
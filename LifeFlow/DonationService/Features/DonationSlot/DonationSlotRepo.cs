using DonationService.Commons;

namespace DonationService.Features.DonationSlot;

public class DonationSlotRepo(DonationServiceContext context) : BaseRepo<Entities.DonationSlot>(context);
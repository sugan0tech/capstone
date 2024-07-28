using DonationService.Commons;

namespace DonationService.Features.Address;

public class AddressRepo(DonationServiceContext context) : BaseRepo<Entities.Address>(context);
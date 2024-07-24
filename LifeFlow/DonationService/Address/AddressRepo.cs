using DonationService.Commons;

namespace DonationService.Address;

public class AddressRepo(DonationServiceContext context) : BaseRepo<Address>(context);
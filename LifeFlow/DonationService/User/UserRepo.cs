using DonationService.Commons;

namespace DonationService.User;

public class UserRepo(DonationServiceContext context) : BaseRepo<DonationService.User.User>(context);
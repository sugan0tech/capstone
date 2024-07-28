using DonationService.Commons;

namespace DonationService.Features.User;

public class UserRepo(DonationServiceContext context) : BaseRepo<Entities.User>(context);
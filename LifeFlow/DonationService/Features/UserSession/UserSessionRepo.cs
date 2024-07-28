using DonationService.Commons;

namespace DonationService.Features.UserSession;

public class UserSessionRepo(DonationServiceContext context) : BaseRepo<Entities.UserSession>(context);
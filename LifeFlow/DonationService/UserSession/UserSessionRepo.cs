using DonationService.Commons;

namespace DonationService.UserSession;

public class UserSessionRepo(DonationServiceContext context) : BaseRepo<DonationService.UserSession.UserSession>(context);
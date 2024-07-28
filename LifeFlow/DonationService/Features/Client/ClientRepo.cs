using DonationService.Commons;

namespace DonationService.Features.Client;

public class ClientRepo(DonationServiceContext context) : BaseRepo<Entities.Client>(context);
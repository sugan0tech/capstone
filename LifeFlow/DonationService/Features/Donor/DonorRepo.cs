using DonationService.Commons;

namespace DonationService.Features.Donor;

public class DonorRepo(DonationServiceContext context) : BaseRepo<Entities.Donor>(context)
{
}
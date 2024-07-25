using AutoMapper;
using DonationService.Commons;

namespace DonationService.BloodCenter;

public class BloodCenterService(IBaseRepo<BloodCenter> repo, IMapper mapper) : BaseService<BloodCenter, BloodCenterDto>(repo, mapper), IBloodCenterService
{
    
}
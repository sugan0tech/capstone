using AutoMapper;
using DonationService.Commons;

namespace DonationService.Features.DonationSlot;

public class DonationSlotService(IBaseRepo<Entities.DonationSlot> repo, IMapper mapper)
    : BaseService<Entities.DonationSlot, DonationSlotDto>(repo, mapper), IDonationSlotService
{
    public async Task<List<DonationSlotDto>> GetAllByCenterId(int centerId)
    {
        var donationSlots = await GetAll();
        return donationSlots.Where(dto => dto.CenterId.Equals(centerId)).ToList();

    }
}
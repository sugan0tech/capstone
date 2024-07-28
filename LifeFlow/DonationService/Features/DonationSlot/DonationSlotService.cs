using AutoMapper;
using DonationService.Commons;

namespace DonationService.Features.DonationSlot;

public class DonationSlotService(IBaseRepo<Entities.DonationSlot> repo, IMapper mapper)
    : BaseService<Entities.DonationSlot, DonationSlotDto>(repo, mapper);
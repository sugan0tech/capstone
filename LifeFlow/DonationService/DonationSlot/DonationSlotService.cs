using AutoMapper;
using DonationService.Commons;

namespace DonationService.DonationSlot;

public class DonationSlotService(IBaseRepo<DonationSlot> repo, IMapper mapper) : BaseService<DonationSlot, DonationSlotDto>(repo, mapper);
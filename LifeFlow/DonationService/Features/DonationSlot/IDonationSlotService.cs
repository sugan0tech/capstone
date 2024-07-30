namespace DonationService.Features.DonationSlot;

public interface IDonationSlotService
{
    public Task<List<DonationSlotDto>> GetAllByCenterId(int centerId);
}
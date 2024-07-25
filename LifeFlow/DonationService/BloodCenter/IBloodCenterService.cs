using DonationService.Commons.Enums;
using DonationService.DonationSlot;

namespace DonationService.BloodCenter;

public interface IBloodCenterService
{
    public Task<List<BloodCenterDto>> GetNearByCenters(double latitude, double longitude);
    public Task<List<BloodCenterDto>> GetCenterByName(string name);
    public Task<DonationSlotDto> BookAppointment(string centerName, int donorId);
    public Task<List<DonationSlotDto>> GetPendingSlots(string centerName);
    public Task<List<DonationSlotDto>> GetCompletedSlots(string centerName);
    public Task ProcessSlot(int slotId, SlotStatus status);
}
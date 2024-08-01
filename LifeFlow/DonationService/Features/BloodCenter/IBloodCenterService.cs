using DonationService.Commons.Enums;
using DonationService.Features.DonationSlot;
using DonationService.Features.UnitBag;

namespace DonationService.Features.BloodCenter;

public interface IBloodCenterService
{
    public Task<List<BloodCenterFetchDto>> GetNearByCenters(double latitude, double longitude);
    public Task<BloodCenterDto> GetCenterByName(string name);
    public Task<DonationSlotDto> BookAppointment(string centerName, int donorId);
    public Task<List<DonationSlotDto>> GetPendingSlots(string centerName);
    public Task<List<DonationSlotDto>> GetCompletedSlots(string centerName);
    public Task ProcessSlot(int slotId, SlotStatus status);

    public Task<List<UnitBagDto>> GetAvailableUnitBags(int centerId);
    public Task<List<UnitBagDto>> GetSoldUnitBags(int centerId);
    public Task<UnitBagDto> GetUnitBag(int unitBagId);
}
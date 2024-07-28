using AutoMapper;
using DonationService.Commons;
using DonationService.Commons.Enums;
using DonationService.Exceptions;
using DonationService.Features.DonationSlot;

namespace DonationService.Features.BloodCenter;

public class BloodCenterService(
    IBaseRepo<Entities.BloodCenter> repo,
    IBaseRepo<Entities.DonationSlot> slotRepo,
    IBaseRepo<Entities.UnitBag> unitBagRepo,
    IBaseRepo<Entities.Donor> donorRepo,
    IMapper mapper) : BaseService<Entities.BloodCenter, BloodCenterDto>(repo, mapper), IBloodCenterService
{
    public async Task<List<BloodCenterFetchDto>> GetNearByCenters(double latitude, double longitude)
    {
        var bloodCenters = await repo.GetAll();
        var distancedCenters = new List<BloodCenterFetchDto>();
        bloodCenters.ForEach(c =>
        {
            var distance = GetDistance(c.Latitude, c.Longitude, latitude, longitude);
            if (distance <= 50)
            {
                var tmp = mapper.Map<BloodCenterFetchDto>(c);
                tmp.Distance = Math.Truncate(distance * 100) / 100;
                distancedCenters.Add(tmp);
            }
        });
        if (distancedCenters.Count == 0)
            throw new OutOfServiceException("Sorry currently we are not serving in this region");
        return distancedCenters.OrderBy(c => c.Distance).Take(5).ToList();
    }

    public async Task<BloodCenterDto> GetCenterByName(string name)
    {
        var bloodCenters = await repo.GetAll();
        var centersByName = bloodCenters
            .First(c => c.Name.Equals(name, StringComparison.OrdinalIgnoreCase));
        return mapper.Map<BloodCenterDto>(centersByName);
    }


    // todo donor id validation
    /// <summary>
    ///     Books appointment with given center name, and returns the created slot.
    /// </summary>
    /// <param name="centerName"></param>
    /// <param name="donorId"></param>
    /// <returns></returns>
    /// <exception cref="KeyNotFoundException"></exception>
    /// <exception cref="NoSlotAvailableException"></exception>
    public async Task<DonationSlotDto> BookAppointment(string centerName, int donorId)
    {
        var donor = await donorRepo.GetById(donorId);
        if (donor.LastDonationTime > DateTime.Today.AddMonths(-4))
            throw new InvalidDonationRequestException("You already have donated blood within 4 past months");

        var bloodCenters = await repo.GetAll();
        var center = bloodCenters.FirstOrDefault(c => c.Name.Equals(centerName, StringComparison.OrdinalIgnoreCase));
        if (center == null)
            throw new KeyNotFoundException($"Blood center with name {centerName} not found");
        if (center.UnitsCapacity <= center.RBCUnits)
            throw new CenterAtMaxCapacityException($"Thank God, {centerName} has enough to serve the humanity today");

        var donationSlots = await slotRepo.GetAll();
        var todaySlots = donationSlots
            .Where(s => s.CenterId == center.Id && s.SlotTime.TimeOfDay > DateTime.Today.TimeOfDay).ToList();

        var groupedSlots = new Dictionary<TimeSpan, List<Entities.DonationSlot>>();
        for (var time = center.OpenByTime; time < center.CloseByTime; time = time.Add(TimeSpan.FromMinutes(20)))
        {
            groupedSlots[time] = todaySlots.Where(s =>
                s.SlotTime.TimeOfDay >= time && s.SlotTime.TimeOfDay < time.Add(TimeSpan.FromMinutes(20))).ToList();
            if (groupedSlots[time].Count < center.UnitsCapacity)
                for (var i = groupedSlots[time].Count; i < center.UnitsCapacity; i++)
                {
                    var newSlot = new Entities.DonationSlot
                    {
                        SlotTime = DateTime.Today.Add(time),
                        SlotStatus = SlotStatus.Pending,
                        DonorId = donorId,
                        CenterId = center.Id
                    };
                    var createdSlot = await slotRepo.Add(newSlot);
                    return mapper.Map<DonationSlotDto>(createdSlot);
                }
        }

        throw new NoSlotAvailableException($"Thank God, {centerName} has enough volunteers serve the humanity today");
    }

    public async Task<List<DonationSlotDto>> GetPendingSlots(string centerName)
    {
        var bloodCenters = await repo.GetAll();
        var center = bloodCenters.FirstOrDefault(c => c.Name.Equals(centerName, StringComparison.OrdinalIgnoreCase));
        if (center == null)
            throw new KeyNotFoundException($"Blood center with name {centerName} not found");

        var donationSlots = await slotRepo.GetAll();
        var pendingSlots = donationSlots.Where(s => s.CenterId == center.Id && s.SlotStatus == SlotStatus.Pending)
            .ToList();
        return mapper.Map<List<DonationSlotDto>>(pendingSlots);
    }

    public async Task<List<DonationSlotDto>> GetCompletedSlots(string centerName)
    {
        var bloodCenters = await repo.GetAll();
        var center = bloodCenters.FirstOrDefault(c => c.Name.Equals(centerName, StringComparison.OrdinalIgnoreCase));
        if (center == null)
            throw new KeyNotFoundException($"Blood center with name {centerName} not found");

        var donationSlots = await slotRepo.GetAll();
        var completedSlots = donationSlots.Where(s =>
                s.CenterId == center.Id && s.SlotStatus is SlotStatus.BloodAccepted or SlotStatus.BloodReceived)
            .ToList();
        return mapper.Map<List<DonationSlotDto>>(completedSlots);
    }

    public async Task ProcessSlot(int slotId, SlotStatus status)
    {
        var slot = await slotRepo.GetById(slotId);
        var donor = await donorRepo.GetById(slot.DonorId);
        switch (status)
        {
            case SlotStatus.BloodAccepted:
                var rbcUnit = new Entities.UnitBag
                {
                    Type = donor.BloodAntigenType,
                    BloodSubtype = donor.BloodSubtype,
                    BloodType = BloodType.RBC,
                    Expiry = DateTime.Now.AddDays(35),
                    DonorId = donor.Id,
                    CenterId = slot.CenterId,
                    IsRare = donor.BloodSubtype.Equals(BloodSubtype.Ro)
                };
                var plateletUnit = new Entities.UnitBag
                {
                    Type = donor.BloodAntigenType,
                    BloodSubtype = donor.BloodSubtype,
                    BloodType = BloodType.Platelet,
                    Expiry = DateTime.Now.AddDays(7),
                    DonorId = donor.Id,
                    CenterId = slot.CenterId,
                    IsRare = donor.BloodSubtype.Equals(BloodSubtype.Ro)
                };
                var plasmaUnit = new Entities.UnitBag
                {
                    Type = donor.BloodAntigenType,
                    BloodSubtype = donor.BloodSubtype,
                    BloodType = BloodType.Plasma,
                    Expiry = DateTime.Now.AddYears(2),
                    DonorId = donor.Id,
                    CenterId = slot.CenterId,
                    IsRare = donor.BloodSubtype.Equals(BloodSubtype.Ro)
                };

                await unitBagRepo.Add(rbcUnit);
                await unitBagRepo.Add(plateletUnit);
                await unitBagRepo.Add(plasmaUnit);

                var center = await repo.GetById(slot.CenterId);
                center.PlasmaUnits++;
                center.RBCUnits++;
                center.PlateletsUnits++;
                await repo.Update(center);

                break;
            case SlotStatus.BloodRejected:
                // todo to notify the donor with reason
                break;
        }

        slot.SlotStatus = status;
        await slotRepo.Update(slot);
    }

    private double GetDistance(double lat1, double lon1, double lat2, double lon2)
    {
        const double R = 6371e3; // metres
        var phi1 = lat1 * Math.PI / 180;
        var phi2 = lat2 * Math.PI / 180;
        var deltaPhi = (lat2 - lat1) * Math.PI / 180;
        var deltaLambda = (lon2 - lon1) * Math.PI / 180;

        var a = Math.Sin(deltaPhi / 2) * Math.Sin(deltaPhi / 2) +
                Math.Cos(phi1) * Math.Cos(phi2) *
                Math.Sin(deltaLambda / 2) * Math.Sin(deltaLambda / 2);
        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

        return R * c / 1000; // distance in km
    }
}
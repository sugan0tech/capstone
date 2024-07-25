using DonationService.Commons.Enums;

namespace DonationService.DonationSlot;

public class DonationSlotDto
{
    public int Id { get; set; }
    public DateTime? SlotTime { get; set; }
    public SlotStatus SlotStatus { get; set; }
    public int? DonorId { get; set; }
    public int? CenterId { get; set; }
}
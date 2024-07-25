using System.ComponentModel.DataAnnotations.Schema;
using DonationService.Commons;
using DonationService.Commons.Enums;

namespace DonationService.DonationSlot;

public class DonationSlot: BaseEntity
{
    
    public TimeSpan SlotTime { get; set; }
    public SlotStatus SlotStatus { get; set; }
    [ForeignKey("DonorId")]
    public required int DonorId { get; set; }

    [ForeignKey("CenterId")]
    public required int CenterId { get; set; }
}
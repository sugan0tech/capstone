using System.ComponentModel.DataAnnotations;
using DonationService.Commons;

namespace DonationService.Entities;

public class Notification : BaseEntity
{
    public string Message { get; set; }
    public int receiverId { get; set; }

    [AllowedValues("User", "Center", "Client")]
    public string receiverKind { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsSent { get; set; } = false;
    public bool IsViewed { get; set; } = false;
}
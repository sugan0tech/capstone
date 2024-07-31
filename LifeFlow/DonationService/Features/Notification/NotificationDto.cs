using System.ComponentModel.DataAnnotations;

namespace DonationService.Features.Notification;

public class NotificationDto
{
    public int Id { get; set; }
    public string Message { get; set; }
    public int receiverId { get; set; }

    [AllowedValues("User", "Center")] public string receiverKind { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsSent { get; set; } = false;
    public bool IsViewed { get; set; } = false;
}
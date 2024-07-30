using System.ComponentModel.DataAnnotations.Schema;
using DonationService.Commons;
using DonationService.Commons.Enums;

namespace DonationService.Entities;

public class Client : BaseEntity
{
    [ForeignKey("UserId")] public int ManagedById { get; set; }
    public User? User { get; set; }
    public ClientType Type { get; set; }
    public string Name { get; set; }
    public int? AddressId { get; set; }
    public List<Order> Orders { get; set; }
}
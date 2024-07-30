using DonationService.Commons.Enums;
using DonationService.Entities;

namespace DonationService.Features.Client;

public class ClientDto
{
    public int ManagedById { get; set; }
    public Entities.User? User { get; set; }
    public ClientType Type { get; set; }
    public string Name { get; set; }
    public int? AddressId { get; set; }
    public List<Order>? Orders { get; set; }
}
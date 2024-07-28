namespace DonationService.Features.Address;

public record AddressDto
{
    public int Id { get; init; }
    public required int EntityId { get; set; }
    public required string EntityType { get; set; }
    public string Street { get; set; }
    public string City { get; set; }
    public string State { get; set; }
    public string Country { get; set; }
    public string ZipCode { get; set; }

    public double Latitude { get; set; }
    public double Longitude { get; set; }
}
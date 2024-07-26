using System.Text.Json.Serialization;

namespace DonationService.GeoCoding;

public class GeocodeResult
{
    [JsonPropertyName("place_id")]
    public long PlaceId { get; set; }
    [JsonPropertyName("display_name")]
    public string DisplayName { get; set; }

    public string Type { get; set; }
    public double Importance { get; set; }
    public string Lat { get; set; }
    public string Lon { get; set; }
}

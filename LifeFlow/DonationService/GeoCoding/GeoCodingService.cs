using System.Text.Json;
using DonationService.GeoCoding;

public class GeocodingService(HttpClient httpClient, IConfiguration configuration)
{
    private static readonly SemaphoreSlim Semaphore = new (1, 1);

    public async Task<List<GeocodeResult>> GeocodeAsync(string query)
    {
        // Enforce the rate limit of 1 request per second
        await Semaphore.WaitAsync();
        try
        {
            var apiKey = configuration["GeoCode:ApiKey"];
            var url = $"https://geocode.maps.co/search?q={Uri.EscapeDataString(query)}&api_key={apiKey}";
            var response = await httpClient.GetStringAsync(url);
            var results = JsonSerializer.Deserialize<List<GeocodeResult>>(response, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
            await Task.Delay(1000); // Delay for 1 second since with the membership tiring concerns
            return results.OrderBy(result => result.Importance).Reverse().Take(5).ToList();
        }
        finally
        {
            Semaphore.Release();
        }
    }
}

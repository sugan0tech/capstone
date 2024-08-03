using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Mvc;

namespace DonationService.Features.GeoCoding;

[ApiController]
[Route("api/[controller]")]
[ExcludeFromCodeCoverage]
public class GeocodingController : ControllerBase
{
    private readonly GeocodingService _geocodingService;

    public GeocodingController(GeocodingService geocodingService)
    {
        _geocodingService = geocodingService;
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string query)
    {
        if (string.IsNullOrWhiteSpace(query)) return BadRequest("Query is required.");

        var results = await _geocodingService.GeocodeAsync(query);
        return Ok(results);
    }
}
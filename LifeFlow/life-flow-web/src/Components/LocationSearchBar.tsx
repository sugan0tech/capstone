import { useState, useEffect } from "react";
import { get } from "../utils/apiService";

interface GeocodeResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

const geocode = (query: string) => {
  return get<GeocodeResult[]>("geocoding/search?query=" + query);
};
function LocationSearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [selectedLocation, setSelectedLocation] =
    useState<GeocodeResult | null>(null);

  useEffect(() => {
    const fetchGeocodeResults = async () => {
      if (query.length > 2) {
        try {
          const data = await geocode(query);
          setResults(data);
        } catch (error) {
          console.error("Geocoding error:", error);
        }
      } else {
        setResults([]);
      }
    };

    const timeoutId = setTimeout(fetchGeocodeResults, 1500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (location: GeocodeResult) => {
    setSelectedLocation(location);
    setQuery(location.display_name);
    setResults([]);
    console.log("Selected coordinates:", {
      lat: location.lat,
      lon: location.lon,
    });
  };
  // <ul className="absolute left-0 right-0 mt-2 bg-white border rounded shadow-lg">

  return (
    <div className="relative z-40">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a location"
        className="grow"
        style={{ width: "600px" }}
      />
      {results.length > 0 && (
        <ul className="absolute left-0 right-0 mt-2 bg-base-200 border rounded shadow-lg">
          {results.map((result) => (
            <li
              key={result.place_id}
              onClick={() => handleSelect(result)}
              className="cursor-pointer border-2 rounded-md p-2 hover:bg-base-300"
            >
              {result.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LocationSearchBar;

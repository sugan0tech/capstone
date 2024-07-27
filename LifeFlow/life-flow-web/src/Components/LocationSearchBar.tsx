import { useState, useEffect } from "react";
import { get } from "../utils/apiService";
import { useApplication } from "../contexts/ApplicationContext";

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
  const { setPickedLocation } = useApplication();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [selectedLocation, setSelectedLocation] =
    useState<GeocodeResult | null>(null);

  useEffect(() => {
    const fetchGeocodeResults = async () => {
      if (selectedLocation !== null) return;
      if (query.length > 2) {
        setIsLoading(true);
        try {
          const data = await geocode(query);
          setResults(data);
        } catch (error) {
          console.error("Geocoding error:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
      }
    };

    const timeoutId = setTimeout(fetchGeocodeResults, 1500);
    return () => clearTimeout(timeoutId);
  }, [query, selectedLocation]);

  const handleSelect = (location: GeocodeResult) => {
    setSelectedLocation(location);
    setQuery(location.display_name);
    setResults([]);
    console.log("Selected coordinates:", {
      lat: location.lat,
      lon: location.lon,
    });
    setPickedLocation({
      lat: location.lat,
      lon: location.lon,
      name: location.display_name,
    });
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setSelectedLocation(null);
  };

  return (
    <>
      <div className="relative z-40">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedLocation(null); // Clear selected location on new input
          }}
          placeholder="Search for a location"
          className="grow"
          style={{ width: "600px" }}
        />
        {query.length > 2 && isLoading && (
          <ul className="absolute left-0 right-0 mt-2 bg-base-200 border rounded shadow-lg">
            <span className="loading loading-dots loading-lg"></span>
          </ul>
        )}

        {results.length === 0 &&
          query.length > 2 &&
          !isLoading &&
          selectedLocation == null && (
            <ul className="absolute left-0 right-0 mt-2 bg-base-200 border rounded shadow-lg">
              <li className="cursor-pointer border-2 rounded-md p-2 hover:bg-base-300">
                No Locations found
              </li>
            </ul>
          )}

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
      {selectedLocation && (
        <button onClick={handleClear} className="kbd">
          Clear
        </button>
      )}
    </>
  );
}

export default LocationSearchBar;

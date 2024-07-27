import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet";

interface Prop {
  name: string;
  lat: string;
  lon: string;
}

interface MapLeafletProps {
  locations: Prop[];
}

function MapUpdater({ center }: { center: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

function MapLeaflet({ locations }: MapLeafletProps) {
  // Convert string coordinates to LatLngExpression
  const convertToLatLng = (lat: string, lon: string): LatLngExpression => {
    return [parseFloat(lat), parseFloat(lon)] as LatLngExpression;
  };

  // Set default center to the first location or a fallback location
  const defaultCenter: LatLngExpression =
    locations.length > 0
      ? convertToLatLng(locations[0].lat, locations[0].lon)
      : [51.505, -0.09];

  return (
    <div className="box-content w-11/12 p-2 z-0" style={{ height: "550px" }}>
      <MapContainer center={defaultCenter} zoom={16} scrollWheelZoom={false}>
        <MapUpdater center={defaultCenter} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location, index) => (
          <Marker
            key={index}
            position={convertToLatLng(location.lat, location.lon)}
          >
            <Popup>{location.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapLeaflet;

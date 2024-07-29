import { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet";
import {AddressCreate} from "./Address/CreateAddress.tsx";

interface MapLeafletProps {
  address: AddressCreate;
  onLocationSelect: (lat: number, lon: number) => void;
}

function MapComponent({ onLocationSelect }: MapLeafletProps) {
  const [markerPosition, setMarkerPosition] = useState<LatLngExpression | null>(
    null
  );

  useMapEvents({
    click(e) {
      setMarkerPosition(e.latlng);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (markerRef.current) {
      const marker = markerRef.current;
      if (marker.leafletElement) {
        marker.leafletElement.on("dragend", () => {
          const newPos = marker.leafletElement.getLatLng();
          setMarkerPosition(newPos);
          onLocationSelect(newPos.lat, newPos.lng);
        });
      }
    }
  }, [markerRef.current]);


  return (
    <>
      {markerPosition && (
        <Marker position={markerPosition} draggable={true} ref={markerRef}>
          <Popup>You clicked here</Popup>
        </Marker>
      )}
    </>
  );
}

function MapPickerLeaflet({ onLocationSelect, address }: MapLeafletProps) {
  const defaultCenter: LatLngExpression =
      address.longitude != 0
          ? [address.latitude, address.longitude]
          : [51.505, -0.09];

  return (
    <div className="box-content w-11/12 p-2 z-0" style={{ height: "550px" }}>
      <MapContainer
        center={defaultCenter}
        zoom={16}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapComponent onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
}

export default MapPickerLeaflet;

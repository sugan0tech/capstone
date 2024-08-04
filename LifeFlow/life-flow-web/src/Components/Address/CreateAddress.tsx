import React, { useEffect, useState } from "react";
import { useAlert } from "../../contexts/AlertContext";
import { get, post } from "../../utils/apiService";
import { useAuth } from "../../contexts/AuthContext";
import MapPickerLeaflet from "../MapPickerLeaflet";
import { GeocodeResult } from "../LocationSearchBar.tsx";

export interface AddressCreate {
  entityId: number;
  entityType: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  latitude: number;
  longitude: number;
}

const geocode = (query: string) => {
  return get<GeocodeResult[]>("geocoding/search?query=" + query);
};

export function CreateAddress({ onSave, onCancel }) {
  const { addAlert } = useAlert();
  const { user, role } = useAuth();
  const entityType = role === "Donor" ? "Donor" : "Client";
  let entityId = 0;
  if (entityType === "Donor") {
    const donorData = localStorage.getItem("Donor");
    if (donorData) {
      const donor = JSON.parse(donorData);
      entityId = donor.id;
    }
  } else if (entityType === "Client") {
    const clientData = localStorage.getItem("Client");
    if (clientData) {
      const client = JSON.parse(clientData);
      entityId = client.id;
    }
  }
  const [address, setAddress] = useState<AddressCreate>({
    entityId: entityId,
    entityType: entityType,
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    console.log(address);
  }, [address]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prevState) => ({
      ...prevState,
      [name]: name === "latitude" || name === "longitude" ? parseFloat(value) : value,
    }));
  };

  const handleLocationSelect = (lat: number, lon: number) => {
    setAddress((prevState) => ({
      ...prevState,
      latitude: lat,
      longitude: lon,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (address.latitude === 0 || address.longitude === 0) {
      addAlert({
        message: "Please select a location on the map.",
        type: "warning",
      });
      return;
    }
    try {
      const response = await post<AddressCreate>("/Address", {
        ...address,
        userId: user?.id || 0,
      });

      localStorage.setItem("address", JSON.stringify(response));

      addAlert({
        message: "Address created successfully!",
        type: "success",
      });
      onSave(response);
      window.location.reload()
    } catch (error: any) {
      addAlert({
        message: error.message || "Failed to create address. Please try again.",
        type: "warning",
      });
    }
  };

  useEffect(() => {
    const query = `${address.city},${address.state},${address.country}`;
    if (address.city && address.state && address.country) {
      geocode(query)
          .then((data) => {
            if (data && data.length > 0) {
              handleLocationSelect(parseFloat(data[0].lat), parseFloat(data[0].lon));
            }
          })
          .catch((error) => {
            console.error("Geocoding error:", error);
          });
    }
  }, [address.city, address.state, address.country]);

  return (
      <dialog id="create_address_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Create Address</h3>
          <form className="w-full " onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">Street</label>
              <input
                  type="text"
                  name="street"
                  className="input input-bordered"
                  value={address.street}
                  onChange={handleChange}
                  required
              />
            </div>
            <div className="form-control">
              <label className="label">City</label>
              <input
                  type="text"
                  name="city"
                  className="input input-bordered"
                  value={address.city}
                  onChange={handleChange}
                  required
              />
            </div>
            <div className="form-control">
              <label className="label">State</label>
              <input
                  type="text"
                  name="state"
                  className="input input-bordered"
                  value={address.state}
                  onChange={handleChange}
                  required
              />
            </div>
            <div className="form-control">
              <label className="label">Country</label>
              <input
                  type="text"
                  name="country"
                  className="input input-bordered"
                  value={address.country}
                  onChange={handleChange}
                  required
              />
            </div>
            <div className="form-control">
              <label className="label">Postal Code</label>
              <input
                  type="text"
                  name="zipCode"
                  className="input input-bordered"
                  value={address.zipCode}
                  onChange={handleChange}
                  required
              />
            </div>
            <div className="form-control">
              <label className="label">Latitude</label>
              <input
                  type="number"
                  name="latitude"
                  className="input input-bordered"
                  value={address.latitude}
                  onChange={handleChange}
                  step="any"
              />
            </div>
            <div className="form-control">
              <label className="label">Longitude</label>
              <input
                  type="number"
                  name="longitude"
                  className="input input-bordered"
                  value={address.longitude}
                  onChange={handleChange}
                  step="any"
              />
            </div>
            <div className="my-4">
              <label>
                <span>Pickup your location</span>
                <MapPickerLeaflet onLocationSelect={handleLocationSelect} address={address} />
              </label>
            </div>
            <div className="flex justify-between mt-4">
              <button type="submit" className="btn btn-secondary">
                Create Address
              </button>
              <button type="button" className="btn btn-error" onClick={onCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
  );
}

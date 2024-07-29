import { useEffect, useState } from "react";
import CentreCard from "../Components/CentreCard";
import LocationSearchBar from "../Components/LocationSearchBar";
import MapLeaflet from "../Components/MapLeaflet";
import UserStatus from "../Components/UserStatus";
import { useApplication } from "../contexts/ApplicationContext";
import { get } from "../utils/apiService";
import { parseTimeSpan } from "../types/TimeSpanAsserts";
import { BloodCenter, BloodCenterApiResponse } from "../types/BloodCenter.ts";

const findCenters = async (
  lat: string,
  lon: string
): Promise<BloodCenter[]> => {
  const response = await get<BloodCenterApiResponse[]>(
    `BloodCenter/nearby?latitude=${lat}&longitude=${lon}`
  );
  return response.map((center) => ({
    id: center.id,
    name: center.name,
    distance: `${center.distance.toFixed(2)} Km`,
    rbc: center.rbcUnits,
    capacity: center.unitsCapacity,
    openBy: parseTimeSpan(center.openByTime),
    closeBy: parseTimeSpan(center.closeByTime),
    latitude: center.latitude,
    longitude: center.longitude,
  }));
};

function FindDonors() {
  const { pickedLocation } = useApplication();
  const [centers, setCenters] = useState<BloodCenter[]>([]);

  useEffect(() => {
    console.log("change occurred: " + pickedLocation?.name);
    const fetchCenters = async () => {
      if (pickedLocation) {
        const centers = await findCenters(
          pickedLocation.lat,
          pickedLocation.lon
        );
        setCenters(centers);
      }
    };
    fetchCenters();
  }, [pickedLocation]);

  // Extract coordinates for MapLeaflet
  const coordinates = centers.map((center) => ({
    name: center.name,
    lat: center.latitude.toString(),
    lon: center.longitude.toString(),
  }));

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-col gap-x-96 items-center bg-base-300 h-48 rounded-box lg:flex-row">
          <div className="flex-1 lg:pl-24 ">
            <label className="input input-bordered flex items-center gap-2">
              <LocationSearchBar />
            </label>
          </div>
          <div className="flex-1">
            <UserStatus />
          </div>
        </div>
      </div>

      <div className="divider"></div>

      <div className="flex flex-col lg:flex-row">
        <div className="card bg-base-300 rounded-box grid flex-1 place-items-center gap-2 h-fill">
          <div
            className="grid grid-cols-2 gap-2 overflow-y-scroll pl-2 pb-2"
            style={{ height: "550px" }}
          >
            {centers.map((center) => (
              <CentreCard
                key={center.id}
                name={center.name}
                distance={center.distance}
                rbc={center.rbc}
                capacity={center.capacity}
                openBy={center.openBy}
                closeBy={center.closeBy}
                address=""
              />
            ))}
          </div>
        </div>

        <div className="divider lg:divider-horizontal"></div>

        <div className="card bg-base-200 rounded-box grid flex-1 place-items-center h-fit">
          <MapLeaflet locations={coordinates} />
        </div>
      </div>
    </>
  );
}

export default FindDonors;

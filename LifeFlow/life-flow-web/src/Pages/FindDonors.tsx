import {useEffect, useState} from "react";
import LocationSearchBar from "../Components/LocationSearchBar";
import MapLeaflet from "../Components/MapLeaflet";
import {useApplication} from "../contexts/ApplicationContext";
import {get} from "../utils/apiService";
import DonorCard from "../Components/Donor/DonorCard.tsx";

interface DonorFetch {
    userId: number;
    bloodAntigenType: string;
    bloodSubType: string;
    distance: string;
    latitude: string;
    longitude: string;
}

const findDonors = async (
    latitude: string,
    longitude: string,
    bloodType: string,
    subtype: string
): Promise<DonorFetch[]> => {
    const response = await get<DonorFetch[]>(
        `Donor/nearby?lat=${latitude}&lon=${longitude}&bloodType=${bloodType}&subtype=${subtype}`
    );
    return response.map((donor) => ({
        userId: donor.userId,
        bloodAntigenType: donor.bloodAntigenType,
        bloodSubType: donor.bloodSubType,
        distance: `${donor.distance} Km`,
        latitude: donor.latitude,
        longitude: donor.longitude,
    }));
};

function FindDonors() {
    const {pickedLocation} = useApplication();
    const [donors, setDonors] = useState<DonorFetch[]>([]);
    const [bloodType, setBloodType] = useState("APositive"); // Default value, update as needed
    const [subtype, setSubtype] = useState("Rhd"); // Default value, update as needed

    useEffect(() => {
        console.log("change occurred: " + pickedLocation?.name);
        const fetchDonors = async () => {
            setDonors([]);
            if (pickedLocation) {
                const donors = await findDonors(
                    pickedLocation.lat,
                    pickedLocation.lon,
                    bloodType,
                    subtype
                );
                setDonors(donors);
            }
        };
        fetchDonors();
    }, [pickedLocation, bloodType, subtype]);

    // Extract coordinates for MapLeaflet
    const coordinates = donors.map((donor) => ({
        name: donor.userId.toString(),
        lat: donor.latitude.toString(),
        lon: donor.longitude.toString(),
    }));

    return (
        <>
            <div className="flex flex-col">
                <div className="flex flex-col gap-x-96 items-center bg-base-300 h-48 rounded-box lg:flex-row">
                    <div className="flex-1 lg:pl-24">
                        <label className="input input-bordered flex items-center gap-2">
                            <LocationSearchBar/>
                        </label>
                    </div>
                    <div className="flex-1 flex flex-col lg:flex-row gap-4">
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Select Patient Antigen Type</span>
                            </div>
                            <select
                                className="select select-bordered w-full max-w-xs"
                                value={bloodType}
                                onChange={(e) => setBloodType(e.target.value)}
                            >
                                <option value="APositive">A+</option>
                                <option value="ANegative">A-</option>
                                <option value="BPositive">B+</option>
                                <option value="BNegative">B-</option>
                                <option value="OPositive">O+</option>
                                <option value="ONegative">O-</option>
                                <option value="ABPositive">AB+</option>
                                <option value="ABNegative">AB-</option>
                            </select>
                        </label>

                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Select subtype</span>
                            </div>
                            <select
                                className="select select-bordered w-full max-w-xs"
                                value={subtype}
                                onChange={(e) => setSubtype(e.target.value)}
                            >
                                <option value="Rhd">Rhd</option>
                                <option value="Ro">Ro</option>
                            </select>
                        </label>
                    </div>
                </div>
            </div>

            <div className="divider"></div>

            <div className="flex flex-col lg:flex-row">
                <div className="card bg-base-300 rounded-box grid flex-1 place-items-center gap-2 h-fill">
                    <div
                        className="grid grid-cols-2 gap-2 overflow-y-scroll pl-2 pb-2"
                        style={{height: "550px"}}
                    >
                        {donors.map((donor) => (
                            <DonorCard
                                key={donor.userId}
                                userId={donor.userId}
                                distance={donor.distance}
                                bloodAntigenType={donor.bloodAntigenType}
                                bloodSubType={donor.bloodSubType}
                            />
                        ))}
                    </div>
                </div>

                <div className="divider lg:divider-horizontal"></div>

                <div className="card bg-base-200 rounded-box grid flex-1 place-items-center h-fit">
                    <MapLeaflet locations={coordinates}/>
                </div>
            </div>
        </>
    );
}

export default FindDonors;

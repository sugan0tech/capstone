import { useEffect, useState } from "react";
import {del, get} from "../utils/apiService";
import { Navigate } from "react-router-dom";
import { Donor } from "../contexts/AuthContext";
import { DonationSlot } from "../types/DonationTypes";
import { useAlert } from "../contexts/AlertContext";
import {OngoingSlot} from "../Components/OgoingSlot.tsx";
import {DonationHistory} from "../Components/Donor/DonationHisotry.tsx";

function MyDonations() {
  const donor = localStorage.getItem("Donor");
  const { addAlert } = useAlert();
  const centerName = localStorage.getItem("Center Name");

  if (donor == null) {
    addAlert({
      message: "Create Donor Profile to continue",
      type: "warning",
    });
    return <Navigate to="/create-donor" />;
  }

  const parsedDonor: Donor = JSON.parse(donor);
  const [ongoingSlot, setOngoingSlot] = useState<DonationSlot | null>(null);
  const [donationHistory, setDonationHistory] = useState<DonationSlot[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const response = await get<DonationSlot[]>(
          "Donor/history/" + parsedDonor.id
      );
      const updatedHistory = await Promise.all(
          response.map(async (slot) => {
            const centerResponse = await get<{ name: string }>(
                "BloodCenter/" + slot.centerId
            );
            slot.centerName = centerResponse.name;
            return slot;
          })
      );
      setDonationHistory(updatedHistory);
    };

    const fetchOngoingSlot = async () => {
      const response = await get<DonationSlot>(
          "Donor/current/" + parsedDonor.id
      );
      setOngoingSlot(response);
    };

    fetchHistory();
    fetchOngoingSlot();
  }, [parsedDonor.id]);

  const handleCancelSlot = async () => {
      await del("DonationSlot/" + ongoingSlot?.id)
    setOngoingSlot(null);
  };
  return (
      <div className="flex flex-col">
        <div className="flex flex-col gap-x-96 items-center bg-base-300 h-48 rounded-box lg:flex-row">
          <div className="flex-1 lg:pl-24">
            <h1 className="text-2xl font-bold">My Donations</h1>
            {centerName && <p>Selected Center: {centerName}</p>}
          </div>
        </div>

        <div className="divider"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <OngoingSlot slot={ongoingSlot} onCancel={handleCancelSlot} />
          </div>
          <div>
            <DonationHistory history={donationHistory} />
          </div>
        </div>
      </div>
  );
}

export default MyDonations;

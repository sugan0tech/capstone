import { useEffect, useState } from "react";
import { get } from "../utils/apiService";
import { Navigate } from "react-router-dom";
import { Donor } from "../contexts/AuthContext";
import { DonationSlot } from "../types/DonationTypes";
import { DonationHistory } from "../Components/DonationHisotry.tsx";
import { OngoingSlot } from "../Components/OgoingSlot.tsx";
import { useAlert } from "../contexts/AlertContext.tsx";

function MyDonations() {
  const donor = localStorage.getItem("Donor");
  const { addAlert } = useAlert();
  if (donor == null) {
    addAlert({
      message: "Create Donor Profile to continue",
      status: "warning",
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
      console.log("mgididi");
      console.log(response);
      setOngoingSlot(response);
    };

    fetchHistory();
    fetchOngoingSlot();
  }, []);

  const handleCancelSlot = async () => {
    // API call to cancel the ongoing slot should be made here
    setOngoingSlot(null);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-x-96 items-center bg-base-300 h-48 rounded-box lg:flex-row">
        <div className="flex-1 lg:pl-24">
          <h1 className="text-2xl font-bold">My Donations</h1>
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

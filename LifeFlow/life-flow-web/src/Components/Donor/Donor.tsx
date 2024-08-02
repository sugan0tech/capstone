import { Address, Donor, useAuth } from "../../contexts/AuthContext.tsx";
import { useEffect, useState } from "react";
import { useAlert } from "../../contexts/AlertContext.tsx";
import { put } from "../../utils/apiService.ts";
import { DonorInfoEdit } from "./DonorInfoEdit.tsx";
import { DonorInfoDisplay } from "./DonorInfoDisplay.tsx";
import { AddressView } from "../Address/AddressView.tsx";

export const DonorComponent = () => {
  const { user } = useAuth();
  const [donorInfo, setDonorInfo] = useState<Donor | null>(null);
  const [addressInfo, setAddressInfo] = useState<Address | null>(null);
  const [isEditingDonor, setIsEditingDonor] = useState(false);
  const { addAlert } = useAlert();

  useEffect(() => {
    const localDonor = localStorage.getItem("Donor");
    const localAddress = localStorage.getItem("address");
    if (localDonor) {
      setDonorInfo(JSON.parse(localDonor));
    } else {
      addAlert({ message: "Please create a donor profile", type: "error" });
    }
    if (localAddress) {
      setAddressInfo(JSON.parse(localAddress));
    }
  }, []);

  const handleUpdateDonorInfo = async (updatedInfo: Donor) => {
    await put(`/donor`, updatedInfo);
    setDonorInfo(updatedInfo);
    localStorage.setItem("Donor", JSON.stringify(updatedInfo));
    setIsEditingDonor(false);
  };

  return (
    <div className="flex flex-col gap-4 bg-base-200 h-fit rounded-btn">
      <div className="card-body">
        <h2 className="card-title">Donor Information</h2>
        {isEditingDonor ? (
          <DonorInfoEdit
            donorInfo={donorInfo}
            onSave={handleUpdateDonorInfo}
            onCancel={() => setIsEditingDonor(false)}
          />
        ) : (
          <DonorInfoDisplay
            donorInfo={donorInfo}
            onEdit={() => setIsEditingDonor(true)}
          />
        )}
      </div>
      <AddressView initialAddress={addressInfo} />
    </div>
  );
};

import {Address, Donor, useAuth} from "../../contexts/AuthContext.tsx";
import {useEffect, useState} from "react";
import {useAlert} from "../../contexts/AlertContext.tsx";
import {put} from "../../utils/apiService.ts";
import {DonorInfoEdit} from "./DonorInfoEdit.tsx";
import {DonorInfoDisplay} from "./DonorInfoDisplay.tsx";
import {EditAddress} from "../Address/EditAddress.tsx";
import {ViewAddress} from "../Address/ViewAddress.tsx";

export const DonorComponent = () => {
    const { user } = useAuth();
    const [donorInfo, setDonorInfo] = useState<Donor | null>(null);
    const [addressInfo, setAddressInfo] = useState<Address | null>(null);
    const [isEditingDonor, setIsEditingDonor] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const { addAlert } = useAlert();

    useEffect(() => {
        const localDonor = localStorage.getItem("Donor");
        const localAddress = localStorage.getItem("address");
        if (localDonor) {
            setDonorInfo(JSON.parse(localDonor));
            if (!localAddress) {
                addAlert({ message: "Please create an address", type: "warning" });
            } else {
                setAddressInfo(JSON.parse(localAddress));
            }
        } else {
            addAlert({ message: "Please create a donor profile", type: "error" });
        }
    }, []);

    const handleUpdateDonorInfo = async (updatedInfo: Donor) => {
        await put(`/donor`, updatedInfo);
        setDonorInfo(updatedInfo);
        localStorage.setItem("Donor", JSON.stringify(updatedInfo));
        setIsEditingDonor(false);
    };

    const handleUpdateAddressInfo = async (updatedInfo: Address) => {
        await put(`/Address`, updatedInfo);
        setAddressInfo(updatedInfo);
        localStorage.setItem("address", JSON.stringify(updatedInfo));
        setIsEditingAddress(false);
    };

    return (
        <div className="flex flex-col-2 bg-base-300 h-fit rounded-btn">
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
            <div className="card-body">
                <h2 className="card-title">Address Info</h2>
                {isEditingAddress ? (
                    <EditAddress
                        address={addressInfo}
                        onSave={handleUpdateAddressInfo}
                        onCancel={() => setIsEditingAddress(false)}
                    />
                ) : (
                    <ViewAddress
                        address={addressInfo}
                        onEdit={() => setIsEditingAddress(true)}
                    />
                )}
            </div>
        </div>
    );
};

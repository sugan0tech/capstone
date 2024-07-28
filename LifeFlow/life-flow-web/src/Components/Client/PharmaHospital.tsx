import {Address, useAuth} from "../../contexts/AuthContext.tsx";
import {useEffect, useState} from "react";
import {put} from "../../utils/apiService.ts";
import {EditAddress} from "../Address/EditAddress.tsx";
import {ViewAddress} from "../Address/ViewAddress.tsx";

export const PharmaHospitalAdminComponent = () => {
    const { user } = useAuth();
    const [hospitalInfo, setHospitalInfo] = useState(null); // Replace with actual type
    const [addressInfo, setAddressInfo] = useState<Address | null>(null);
    const [isEditingHospital, setIsEditingHospital] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);

    useEffect(() => {
        // Fetch hospital info and address
        // Set hospitalInfo and addressInfo accordingly
    }, []);

    const handleUpdateHospitalInfo = async (updatedInfo) => {
        // Update hospital info logic
        setHospitalInfo(updatedInfo);
        setIsEditingHospital(false);
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
                <h2 className="card-title">Hospital Information</h2>
                {isEditingHospital ? (
                    <EditHospitalInfo
                        hospitalInfo={hospitalInfo}
                        onSave={handleUpdateHospitalInfo}
                        onCancel={() => setIsEditingHospital(false)}
                    />
                ) : (
                    <HospitalInfo
                        hospitalInfo={hospitalInfo}
                        onEdit={() => setIsEditingHospital(true)}
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

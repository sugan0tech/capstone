import React, { useState, useEffect } from "react";
import { put, post } from "../../utils/apiService.ts";
import { Address, useAuth } from "../../contexts/AuthContext.tsx";
import { useAlert } from "../../contexts/AlertContext.tsx";
import { EditAddress } from "../Address/EditAddress.tsx";
import { ViewAddress } from "../Address/ViewAddress.tsx";
import { CreateAddress } from "../Address/CreateAddress.tsx";

interface AddressViewProps {
  initialAddress: Address | null;
}

export const AddressView: React.FC<AddressViewProps> = ({ initialAddress }) => {
  const { user } = useAuth();
  const { addAlert } = useAlert();
  const [addressInfo, setAddressInfo] = useState<Address | null>(
    initialAddress
  );
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isCreatingAddress, setIsCreatingAddress] = useState(false);
  const [hasAddress, setHasAddress] = useState(!!initialAddress);

  useEffect(() => {
    if (!initialAddress) {
      addAlert({ message: "Please create an address", type: "warning" });
    }
  }, [initialAddress]);

  const handleUpdateAddressInfo = async (updatedInfo: Address) => {
    await put(`/address`, updatedInfo);
    setAddressInfo(updatedInfo);
    localStorage.setItem("address", JSON.stringify(updatedInfo));
    setIsEditingAddress(false);
  };

  const handleCreateAddress = async (newAddress: Address) => {
    const createdAddress = await post<Address>("/address", newAddress);
    setAddressInfo(createdAddress);
    localStorage.setItem("address", JSON.stringify(createdAddress));
    setIsCreatingAddress(false);
    setHasAddress(true);
  };

  return (
    <div className="card-body">
      <h2 className="card-title">Address Info</h2>
      {!hasAddress ? (
        <>
          <button
            className="btn btn-accent"
            onClick={() => setIsCreatingAddress(true)}
          >
            Create Address
          </button>
          {isCreatingAddress && (
            <CreateAddress
              onSave={handleCreateAddress}
              onCancel={() => setIsCreatingAddress(false)}
            />
          )}
        </>
      ) : isEditingAddress ? (
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
  );
};

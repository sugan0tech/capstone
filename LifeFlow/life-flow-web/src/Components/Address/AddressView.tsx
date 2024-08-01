import React, { useState, useEffect } from "react";
import {put, post, get} from "../../utils/apiService.ts";
import {Address, Client as ClientType, useAuth} from "../../contexts/AuthContext.tsx";
import { useAlert } from "../../contexts/AlertContext.tsx";
import { EditAddress } from "./EditAddress.tsx";
import { ViewAddress } from "./ViewAddress.tsx";
import { CreateAddress } from "./CreateAddress.tsx";

interface AddressViewProps {
  initialAddress: Address | null;
}

export const AddressView: React.FC<AddressViewProps> = () => {
  const { user } = useAuth();
  const { addAlert } = useAlert();
  const [addressInfo, setAddressInfo] = useState<Address | null>(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isCreatingAddress, setIsCreatingAddress] = useState(false);
  const [hasAddress, setHasAddress] = useState(false);

  useEffect(() => {
    const localAddress = localStorage.getItem("address");
    if (localAddress) {
      setAddressInfo(JSON.parse(localAddress));
      setHasAddress(true);
    } else {

      const response = get<ClientType>(`/client/user/${user?.id}`);
      response.then(val => {
        console.log(val)
        if (!val.addressId) {
          addAlert({ message: "Please create an address", type: "warning" });
        } else {
          const response = get<Address>(`address/${val.addressId}`)
          response.then((addr) => {
            localStorage.setItem("address", JSON.stringify(addr));
            setAddressInfo(addr)
            setHasAddress(true);
          })
        }
      })

    }
  }, [])

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

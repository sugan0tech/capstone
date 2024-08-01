import {useEffect, useState} from "react";
import {get, post, put} from "../../utils/apiService";
import {Address, Client as ClientType, useAuth} from "../../contexts/AuthContext";
import {EditClient} from "./EditClient";
import {ViewClient} from "./ViewClient";
import {CreateClient} from "./CreateClient";
import {useAlert} from "../../contexts/AlertContext";
import {AddressView} from "../Address/AddressView.tsx";

const Client = () => {
    const {user} = useAuth();
    const {addAlert} = useAlert();
    const [addressInfo, setAddressInfo] = useState<Address | null>(null);
    const [isEditingClient, setIsEditingClient] = useState(false);
    const [isCreatingClient, setIsCreatingClient] = useState(false);
    const [client, setClient] = useState<ClientType>(null);

    useEffect(() => {
        const localAddress = localStorage.getItem("address");
        if (localAddress) {
            setAddressInfo(JSON.parse(localAddress));
        } else {

            const response = get<ClientType>(`/client/user/${user?.id}`);
            response.then(val => {
                console.log(val)
                setClient(val)
                if (!val.addressId) {
                    addAlert("No address found for client", "warning");
                } else {
                    const response = get<Address>(`address/${val.addressId}`)
                    response.then((addr) => {
                        localStorage.setItem("address", JSON.stringify(addr));
                        setAddressInfo(addr)
                    })
                }
            })

        }
    }, []);

    const fetchClientInfo = async () => {
        if (user?.role === "PharmaAdmin" || user?.role === "HospitalAdmin") {
            const clientData = await get(`/client/user/${user?.id}`);
            setClient(clientData);
            if (!clientData.addressId) {
                addAlert("No address found for client", "warning");
            } else {
                const address = await get<Address>(`address/${clientData.addressId}`)
                setAddressInfo(address)
            }
        }
    };

    const handleUpdateClientInfo = async (updatedClient) => {
        await put(`/client`, updatedClient);
        setIsEditingClient(false);
        fetchClientInfo(); // Refresh client info after update
    };

    const handleCreateClient = async (newClient) => {
        await post(`/client`, newClient);
        setIsCreatingClient(false);
        fetchClientInfo(); // Refresh client info after creation
    };

    useEffect(() => {
        fetchClientInfo();
    }, [user]);

    return (
        <div className="card bg-base-300 h-fit rounded-btn">
            <div className="card-body">
                <h2 className="card-title">Client Information</h2>
                {isCreatingClient ? (
                    <CreateClient
                        onSave={handleCreateClient}
                        onCancel={() => setIsCreatingClient(false)}
                        currentUserId={user.id}
                    />
                ) : client ? (
                    isEditingClient ? (
                        <EditClient
                            client={client}
                            onSave={handleUpdateClientInfo}
                            onCancel={() => setIsEditingClient(false)}
                        />
                    ) : (
                        <ViewClient
                            client={client}
                            onEdit={() => setIsEditingClient(true)}
                        />
                    )
                ) : (
                    <div>
                        <div>No Client Profile found</div>
                        <button
                            className="btn btn-primary mt-4"
                            onClick={() => setIsCreatingClient(true)}
                        >
                            Create Client
                        </button>
                    </div>
                )}
                <AddressView />
            </div>
        </div>
    );
};

export default Client;

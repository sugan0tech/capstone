import { useState, useEffect } from "react";
import { post, put, get } from "../../utils/apiService";
import { useAuth } from "../../contexts/AuthContext";
import { EditClient } from "./EditClient";
import { ViewClient } from "./ViewClient";
import { CreateClient } from "./CreateClient";
import { useAlert } from "../../contexts/AlertContext";

const Client = () => {
  const { user } = useAuth();
  const { addAlert } = useAlert();
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  const [client, setClient] = useState(null);

  const fetchClientInfo = async () => {
    if (user?.role === "PharmaAdmin" || user?.role === "HospitalAdmin") {
      const clientData = await get(`/client/${user?.clientId}`);
      setClient(clientData);
      if (!clientData.addressId) {
        addAlert("No address found for client", "warning");
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
          <button
            className="btn btn-primary mt-4"
            onClick={() => setIsCreatingClient(true)}
          >
            Create Client
          </button>
        )}
      </div>
    </div>
  );
};

export default Client;

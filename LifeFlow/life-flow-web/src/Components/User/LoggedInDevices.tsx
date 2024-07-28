import { useState, useEffect } from "react";
import { get, del, post } from "../../utils/apiService";
import { useAuth } from "../../contexts/AuthContext";
import { useAlert } from "../../contexts/AlertContext";

export interface Device {
  sessionId: number;
  deviceType: string;
  isValid: boolean;
  lastActive: string;
}

const LoggedInDevices = () => {
  const { user } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const { addAlert } = useAlert();

  useEffect(() => {
    const fetchDevices = async () => {
      const response = await get<Device[]>(`UserSession/`);
      setDevices(response);
    };

    fetchDevices();
  }, []);

  const handleLogoutDevice = async (deviceId: number) => {
    await del("UserSession/" + deviceId);
    setDevices(devices.filter((device) => device.sessionId !== deviceId));
  };

  const handleLogoutAllDevices = async () => {
    await post("UserSession/invalidateAll" + user?.id);
    setDevices([]);
  };

  return (
    <div className="card bg-base-300 h-fit rounded-btn">
      <div className="card-body">
        <h2 className="card-title">Logged In Devices</h2>
        <div className="overflow-y-scroll" style={{ maxHeight: "300px" }}>
          {devices.map((device) => (
            <div
              key={device.sessionId}
              className={`card bg-base-200 h-fit rounded-btn mb-2 ${
                device.isValid ? "border-2 border-primary" : ""
              }`}
            >
              <div className="card-body">
                <h3 className="card-title">{device.deviceType}</h3>
                <p>Last Active: {device.lastActive}</p>
                <div className="card-actions justify-end">
                  {!device.isValid && (
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleLogoutDevice(device.sessionId)}
                    >
                      Logout Device
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          className="btn btn-primary mt-4"
          onClick={handleLogoutAllDevices}
        >
          Logout All Devices
        </button>
      </div>
    </div>
  );
};

export default LoggedInDevices;

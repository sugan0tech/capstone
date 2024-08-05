import { useState, useEffect } from "react";
import { get, del, post } from "../../utils/apiService";
import { useAuth } from "../../contexts/AuthContext";
import { useAlert } from "../../contexts/AlertContext";
import { UAParser } from "ua-parser-js";
import { useTranslation } from "react-i18next";

export interface Device {
  sessionId: number;
  deviceType: string;
  isValid: boolean;
  createdAt: string;
  userAgent: string;
}

const LoggedInDevices = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [devices, setDevices] = useState<Device[]>([]);
  const { addAlert } = useAlert();

  useEffect(() => {
    const fetchDevices = async () => {
      const response = await get<Device[]>(`UserSession/user`);
      const validDevices = response.filter((device) => device.isValid);
      setDevices(validDevices);
    };

    fetchDevices();
  }, []);

  const handleLogoutDevice = async (deviceId: number) => {
    await del("UserSession/" + deviceId);
    setDevices(devices.filter((device) => device.sessionId !== deviceId));
  };

  const handleLogoutAllDevices = async () => {
    await post("UserSession/invalidateAll/" + user?.id);
    setDevices([]);
  };

  const parseUserAgent = (userAgent: string) => {
    const parser = new UAParser(userAgent);
    const os = parser.getOS();
    const browser = parser.getBrowser();
    if (!os.name) return userAgent;
    return `${browser.name} ${t('loggedInDevices.browser')} ${os.name}`;
  };

  return (
      <div className="card bg-base-200 h-fil rounded-btn">
        <div className="card-body">
          <h2 className="card-title">{t('loggedInDevices.title')}</h2>
          <div className="overflow-y-scroll" style={{ maxHeight: "600px" }}>
            {devices.map((device) => (
                <div
                    key={device.sessionId}
                    className="card bg-base-300 shadow-md h-fit rounded-btn mb-2"
                >
                  <div className="card-body">
                    <h3 className="card-title">{device.deviceType}</h3>
                    <p>{t('loggedInDevices.loggedInAt')}: {new Date(device.createdAt).toLocaleString()}</p>
                    <p>{t('loggedInDevices.deviceInfo')}: {parseUserAgent(device.userAgent)}</p>
                    <div className="card-actions justify-end">
                      <button
                          className="btn btn-secondary"
                          onClick={() => handleLogoutDevice(device.sessionId)}
                      >
                        {t('loggedInDevices.logoutDevice')}
                      </button>
                    </div>
                  </div>
                </div>
            ))}
          </div>
          <button
              className="btn btn-primary mt-4"
              onClick={handleLogoutAllDevices}
          >
            {t('loggedInDevices.logoutAllDevices')}
          </button>
        </div>
      </div>
  );
};

export default LoggedInDevices;

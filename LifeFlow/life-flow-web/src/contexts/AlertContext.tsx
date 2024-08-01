import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import SuccessSvg from "../assets/SuccessSvg";
import ErrorSvg from "../assets/ErrorSvg";
import WarningSvg from "../assets/WarningSvg";
import InfoSvg from "../assets/InfoSvg";

interface AlertContextType {
  addAlert: (alert: Alert) => void;
}

// Create a Context for the alert
const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => useContext(AlertContext);

interface AuthProviderProps {
  children: ReactNode;
}

interface Alert {
  message: string;
  type: "success" | "error" | "warning" | "info";
}

const AlertProvider = ({ children }: AuthProviderProps) => {
  const [alert, setAlert] = useState<Alert | null>(null);

  const addAlert = useCallback((alert: Alert) => {
    if (alert.type && alert.message){
        setAlert(alert);
    }

    // Auto-remove the alert after 3 seconds
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  }, []);

  const removeAlert = useCallback(() => {
    setAlert(null);
  }, []);

  const selectSvg = (type: "success" | "error" | "warning" | "info") => {
    switch (type) {
      case "success":
        return <SuccessSvg />;
      case "error":
        return <ErrorSvg />;
      case "warning":
        return <WarningSvg />;
      case "info":
        return <InfoSvg />;
      default:
        return <InfoSvg />;
    }
  };

  return (
    <AlertContext.Provider value={{ addAlert }}>
      {children}
      {alert && (
        <div className="fixed bottom-4 right-4 w-80 z-40">
          <div role="alert" className={`alert alert-${alert.type} p-4 mb-4`} >
            <div>
              {selectSvg(alert.type)}
              <span>{alert.message}</span>
              <br />
              <button
                onClick={removeAlert}
                className={`btn btn-${alert.type} `}
              >
                close X
              </button>
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
};

export default AlertProvider;

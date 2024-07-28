import React, { createContext, useState, useContext, useEffect } from "react";

export interface Center {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  unitsCapacity: number;
  rbcUnits: number;
  plateletsUnits: number;
  plasmaUnits: number;
  isCentralReserve: boolean;
  slotsCapacity: number;
  addressId: number | null;
  openByTime: string;
  closeByTime: string;
}

interface CenterContextType {
  selectedCenter: Center | null;
  setSelectedCenter: (center: Center) => void;
}

const CenterContext = createContext<CenterContextType | undefined>(undefined);

export const CenterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedCenter, setSelectedCenterState] = useState<Center | null>(() =>
    JSON.parse(localStorage.getItem("selectedCenter") || "null")
  );

  const setSelectedCenter = (center: Center) => {
    localStorage.setItem("selectedCenter", JSON.stringify(center));
    setSelectedCenterState(center);
  };

  useEffect(() => {
    const storedCenter = localStorage.getItem("selectedCenter");
    if (storedCenter) {
      setSelectedCenterState(JSON.parse(storedCenter));
    }
  }, []);

  return (
    <CenterContext.Provider value={{ selectedCenter, setSelectedCenter }}>
      {children}
    </CenterContext.Provider>
  );
};

export const useCenter = (): CenterContextType => {
  const context = useContext(CenterContext);
  if (!context) {
    throw new Error("useCenter must be used within a CenterProvider");
  }
  return context;
};

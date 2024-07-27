import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the interface for the context
export interface Location {
  name: string;
  lat: string;
  lon: string;
}

interface ApplicationContextType {
  pickedLocation: Location | null;
  setPickedLocation: (location: Location | null) => void;
}

// Create the context
const ApplicationContext = createContext<ApplicationContextType | undefined>(
  undefined
);

interface ApplicationProviderProps {
  children: ReactNode;
}

// Implement the provider component
export const ApplicationProvider: React.FC<ApplicationProviderProps> = ({
  children,
}) => {
  const [pickedLocation, setPickedLocation] = useState<Location | null>(null);

  return (
    <ApplicationContext.Provider value={{ pickedLocation, setPickedLocation }}>
      {children}
    </ApplicationContext.Provider>
  );
};

// some custom hooks
export const useApplication = (): ApplicationContextType => {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error(
      "useApplication must be used within an ApplicationProvider"
    );
  }
  return context;
};

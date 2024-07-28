import { useState } from "react";
import { Center, useCenter } from "../contexts/CenterContext";
import { post } from "../utils/apiService";
import CenterList from "../Components/Center/CenterList";

const BloodCenterConsole: React.FC = () => {
  const { selectedCenter } = useCenter();
  const [newCenter, setNewCenter] = useState<Center>({
    id: 0,
    name: "",
    latitude: 0,
    longitude: 0,
    unitsCapacity: 0,
    rbcUnits: 0,
    plateletsUnits: 0,
    plasmaUnits: 0,
    isCentralReserve: false,
    slotsCapacity: 0,
    addressId: null,
    openByTime: "00:00:00",
    closeByTime: "00:00:00",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCenter((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await post("/BloodCenter", newCenter);
  };

  return (
    <div>
      <CenterList />
    </div>
  );
};

export default BloodCenterConsole;

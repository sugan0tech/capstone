import React, { useEffect, useState } from "react";
import { useCenter, Center } from "../../contexts/CenterContext";
import { get } from "../../utils/apiService";

const CenterList: React.FC = () => {
  const [centers, setCenters] = useState<Center[]>([]);
  const { setSelectedCenter } = useCenter();

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await get<Center[]>("/BloodCenter/all");
        setCenters(response);
      } catch (error) {
        console.error("Error fetching centers", error);
      }
    };

    fetchCenters();
  }, []);

  const handleSelectCenter = (center: Center) => {
    setSelectedCenter(center);
  };

  return (
    <div>
      <h2>Select a Center</h2>
      <ul>
        {centers.map((center) => (
          <li key={center.id} onClick={() => handleSelectCenter(center)}>
            {center.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CenterList;

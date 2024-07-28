import React, { useEffect, useState } from "react";
import { useCenter, Center } from "../../contexts/CenterContext";
import { get } from "../../utils/apiService";
import {
  formatTimeSpan12Hour,
  parseTimeSpan,
} from "../../types/TimeSpanAsserts";

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
    <div className="card bg-base-300 h-fit rounded-btn">
      <div className="card-body">
        <h2 className="card-title">Centers:</h2>
        <div className="overflow-y-scroll" style={{ maxHeight: "300px" }}>
          {centers.map((center) => (
            <div
              key={center.id}
              className={`card bg-base-200 h-fit rounded-btn mb-2 ${
                center.isCentralReserve ? "border-2 border-primary" : ""
              }`}
            >
              <div className="card-body">
                <h3 className="card-title">{center.name}</h3>
                <p>
                  opens At :{" "}
                  {formatTimeSpan12Hour(parseTimeSpan(center.openByTime))}
                </p>
                <p>
                  closes At :{" "}
                  {formatTimeSpan12Hour(parseTimeSpan(center.closeByTime))}
                </p>
                <div className="card-actions justify-end">
                  {!center.isCentralReserve && (
                    <div className="badge badge-success">Central reserve</div>
                  )}
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleSelectCenter(center)}
                  >
                    select
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CenterList;

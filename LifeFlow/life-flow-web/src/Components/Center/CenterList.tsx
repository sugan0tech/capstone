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
      <div className="card bg-base-200 h-fit rounded-btn">
        <div className="card-body">
          <h2 className="card-title">Centers:</h2>
          <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-y-scroll"
              style={{ maxHeight: "450px" }}
          >
            {centers.map((center) => (
                <div
                    key={center.id}
                    className={`card bg-base-300 flex-1 h-fill rounded-btn mb-2 shadow-lg ${
                        !center.isCentralReserve ? "border-2 border-success" : ""
                    }`}
                >
                  <div className="card-body">
                    <h3 className="card-title">{center.name}</h3>
                    <p>
                      Opens at:{" "}
                      {formatTimeSpan12Hour(parseTimeSpan(center.openByTime))}
                    </p>
                    <p>
                      Closes at:{" "}
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
                        Select
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

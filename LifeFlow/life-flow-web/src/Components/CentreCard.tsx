import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { formatTimeSpan12Hour, parseTimeSpan, TimeSpan } from "../types/TimeSpanAsserts";
import { useTranslation } from "react-i18next";

interface BloodCenterProps {
    name: string;
    distance: string;
    rbc: number;
    capacity: number;
    openBy: TimeSpan;
    closeBy: TimeSpan;
    address: string;
}

function CentreCard({
                        name = "Center Name",
                        distance = "5km",
                        rbc = 0,
                        capacity = 1,
                        address = "Kumarn stree, velumqani, chennai, tamilnadu. 73728",
                        openBy = parseTimeSpan("09:00:00"),
                        closeBy = parseTimeSpan("18:00:00"),
                    }: BloodCenterProps) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useTranslation(); // Initialize useTranslation hook

    const handleButtonClick = () => {
        localStorage.setItem("centerName", name);
        if (user?.role === "Donor") {
            navigate("/my-donations");
        } else {
            // Show an alert or handle other roles if necessary
        }
    };

    const getButtonText = () => {
        switch (user?.role) {
            case "Donor":
                return t("centreCard.donateHere"); // Translated text
            case "HospitalAdmin":
            case "PharmaAdmin":
                return t("centreCard.orderFromHere"); // Translated text
            default:
                return null;
        }
    };

    const buttonText = getButtonText();

    return (
        <div className="card-body bg-base-300 h-fit rounded-btn shadow-md">
            <h2 className="card-title">{name}</h2>
            <p>
                {distance} {t("centreCard.away")}. {address}
            </p>
            <div className="flex gap-2">
                <div className="badge badge-info">
                    {t("centreCard.stock")}: {rbc}/{capacity}
                </div>
                <div className="badge badge-info">
                    {t("centreCard.from")} {formatTimeSpan12Hour(openBy)} {t("centreCard.to")} {formatTimeSpan12Hour(closeBy)}
                </div>
            </div>
            {buttonText && (
                <div className="card-actions justify-end">
                    <button className="btn btn-primary" onClick={handleButtonClick}>
                        {buttonText}
                    </button>
                </div>
            )}
        </div>
    );
}

export default CentreCard;

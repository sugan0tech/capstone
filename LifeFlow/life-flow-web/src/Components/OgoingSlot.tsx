import React, { useState } from "react";
import { get, post } from "../utils/apiService";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../contexts/AlertContext.tsx";
import { useTranslation } from "react-i18next";

export function OngoingSlot({ slot, onCancel }) {
    const [centerName, setCenterName] = useState(localStorage.getItem("centerName") || "");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { addAlert } = useAlert();
    const { t } = useTranslation();

    if (slot) {
        const centerResponse = get("BloodCenter/" + slot.centerId);
        centerResponse.then((value) => {
            slot.centerName = value.name;
        });
    }

    const handleBooking = async () => {
        setLoading(true);
        try {
            const response = await post(`https://donationservice.azurewebsites.net/api/BloodCenter/${centerName}/book/1`, {
                headers: {
                    Accept: "text/plain",
                    Authorization: "{{apiKey}}",
                },
            });
            // Handle successful booking, e.g., refresh the slot or display a success message
            addAlert(t("ongoingSlot.alerts.bookingSuccess"), "success");
        } catch (error) {
            addAlert(t("ongoingSlot.alerts.bookingError") + error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card bg-base-200 h-fit rounded-btn">
            <div className="card-body">
                <h2 className="card-title">{slot ? t("ongoingSlot.title") : t("ongoingSlot.noSlot")}</h2>
                {slot ? (
                    <div>
                        <p>
                            {t("ongoingSlot.slotBookedFor")} {slot.centerName} {t("ongoingSlot.at")}{" "}
                            {new Date(slot.slotTime).toLocaleString("en-IN", {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                            })}
                        </p>
                        <button className="btn btn-secondary" onClick={onCancel}>
                            {t("ongoingSlot.cancelSlot")}
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="form-group">
                            <label htmlFor="centerName">{t("ongoingSlot.centerNameLabel")}</label>
                            <input
                                type="text"
                                id="centerName"
                                placeholder={t("ongoingSlot.centerNamePlaceholder")}
                                value={centerName}
                                onChange={(e) => setCenterName(e.target.value)}
                                className="form-control input input-bordered w-full max-w-xs"
                            />
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={handleBooking}
                            disabled={loading}
                        >
                            {loading ? t("ongoingSlot.booking") : t("ongoingSlot.bookSlot")}
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate("/find-centers")}
                        >
                            {t("ongoingSlot.findCentersNearby")}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

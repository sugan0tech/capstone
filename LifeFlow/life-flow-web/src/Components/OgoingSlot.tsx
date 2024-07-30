import React, {useState} from "react";
import {get, post} from "../utils/apiService";
import {useNavigate} from "react-router-dom";
import {useAlert} from "../contexts/AlertContext.tsx";

export function OngoingSlot({slot, onCancel}) {
    const [centerName, setCenterName] = useState(localStorage.getItem("centerName") || "");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {addAlert} = useAlert();

    if (slot) {
        const centerResponse = get("BloodCenter/" + slot.centerId);
        centerResponse.then((value) => {
            console.log(value)
            slot.centerName = value.name
        })
    }

    const handleBooking = async () => {
        setLoading(true);
        try {
            const response = await post(`http://localhost:5226/api/BloodCenter/${centerName}/book/1`, {
                headers: {
                    'Accept': 'text/plain',
                    'Authorization': '{{apiKey}}',
                }
            });
            // Handle successful booking, e.g., refresh the slot or display a success message
            addAlert('Booking successful!', 'success');
        } catch (error) {
            addAlert('Error booking slot: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card bg-base-300 h-fit rounded-btn">
            <div className="card-body">
                <h2 className="card-title">{slot ? 'Ongoing Slot' : 'No ongoing slot'}</h2>
                {slot ? (
                    <div>
                        <p>
                            Slot booked for {slot.centerName} at{" "}
                            {new Date(slot.slotTime).toLocaleString("en-IN", {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                            })}
                        </p>
                        <button className="btn btn-secondary" onClick={onCancel}>
                            Cancel Slot
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="form-group">
                            <label htmlFor="centerName">Center Name</label>
                            <input
                                type="text"
                                id="centerName"
                                value={centerName}
                                onChange={(e) => setCenterName(e.target.value)}
                                className="form-control"
                            />
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={handleBooking}
                            disabled={loading}
                        >
                            {loading ? 'Booking...' : 'Book a Slot'}
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate('/find-centers')}
                        >
                            Find Centers Nearby
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

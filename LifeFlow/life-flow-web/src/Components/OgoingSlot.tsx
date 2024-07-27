import {DonationSlot} from "../types/DonationTypes.ts";

export function OngoingSlot(slot: DonationSlot | null, onCancel) {
    if (slot) {
        return (
            <div className="card bg-base-300 h-fit rounded-btn">
                <div className="card-body">
                    <h2 className="card-title">No ongoing slot</h2>
                    <button className="btn btn-primary">Book a Slot</button>
                </div>
            </div>
        );
    }

    return (
        <div className="card bg-base-300 h-fit rounded-btn">
            <div className="card-body">
                <h2 className="card-title">Ongoing Slot</h2>
                <p>
                    Slot booked for {slot.date} at {slot.time}
                </p>
                <button className="btn btn-secondary" onClick={onCancel}>
                    Cancel Slot
                </button>
            </div>
        </div>
    );
}


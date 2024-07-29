import { get } from "../utils/apiService";

export function OngoingSlot({ slot , onCancel }) {

  if (!slot) {
    return (
      <div className="card bg-base-300 h-fit rounded-btn">
        <div className="card-body">
          <h2 className="card-title">No ongoing slot</h2>
          <button className="btn btn-primary">Book a Slot</button>
        </div>
      </div>
    );
  }

  const centerResponse = get("BloodCenter/" + slot.centerId);
  centerResponse.then((value) => {
    console.log(value)
    slot.centerName = value.name
  })

  return (
    <div className="card bg-base-300 h-fit rounded-btn">
      <div className="card-body">
        <h2 className="card-title">Ongoing Slot</h2>
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
    </div>
  );
}

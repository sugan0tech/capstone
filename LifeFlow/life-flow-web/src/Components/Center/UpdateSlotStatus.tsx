import React, { useState } from "react";
import axios from "axios";
import { SlotStatus, DonationSlot } from "./DonationSlots";

interface UpdateSlotStatusProps {
  slot: DonationSlot;
}
const UpdateSlotStatus: React.FC<UpdateSlotStatusProps> = ({ slot }) => {
  const [status, setStatus] = useState<SlotStatus>(slot.slotStatus);

  const handleChangeStatus = async (newStatus: SlotStatus) => {
    try {
      await axios.put(`/DonationSlot/${slot.id}`, {
        ...slot,
        slotStatus: newStatus,
      });
      setStatus(newStatus);
    } catch (error) {
      console.error("Error updating slot status", error);
    }
  };

  return (
    <div>
      <p>{slot.slotTime}</p>
      <select
        value={status}
        onChange={(e) => handleChangeStatus(e.target.value as SlotStatus)}
      >
        {Object.values(SlotStatus).map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );
};

export default UpdateSlotStatus;

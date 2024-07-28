import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCenter } from "../contexts/CenterContext";

export interface DonationSlot {
  id: number;
  slotTime: string;
  slotStatus: SlotStatus;
  donorId: number;
  centerId: number;
}

export enum SlotStatus {
  BloodReceived = "BloodReceived",
  BloodAccepted = "BloodAccepted",
  BloodRejected = "BloodRejected",
  DonorNotArrived = "DonorNotArrived",
  Pending = "Pending",
}

const Donations: React.FC = () => {
  const { selectedCenter } = useCenter();
  const [ongoingSlots, setOngoingSlots] = useState<DonationSlot[]>([]);
  const [pendingSlots, setPendingSlots] = useState<DonationSlot[]>([]);
  const [completedSlots, setCompletedSlots] = useState<DonationSlot[]>([]);

  useEffect(() => {
    if (selectedCenter) {
      const fetchSlots = async () => {
        try {
          const response = await axios.get<DonationSlot[]>(
              `/DonationSlot/all/${selectedCenter.id}`
          );

          const ongoing = response.data.filter(
              (slot) =>
                  slot.slotStatus !== SlotStatus.Pending &&
                  slot.slotStatus !== SlotStatus.BloodReceived
          );
          const pending = response.data.filter(
              (slot) => slot.slotStatus === SlotStatus.Pending
          );
          const completed = response.data.filter(
              (slot) => slot.slotStatus === SlotStatus.BloodReceived
          );

          // Check if slots are empty and add test data if necessary
          if (ongoing.length === 0) {
            ongoing.push(
                { id: 1, slotTime: "2024-07-27T08:00:00", slotStatus: SlotStatus.BloodAccepted, donorId: 1, centerId: selectedCenter.id },
                { id: 2, slotTime: "2024-07-27T09:00:00", slotStatus: SlotStatus.BloodRejected, donorId: 2, centerId: selectedCenter.id },
                { id: 3, slotTime: "2024-07-27T10:00:00", slotStatus: SlotStatus.DonorNotArrived, donorId: 3, centerId: selectedCenter.id }
            );
          }

          if (pending.length === 0) {
            pending.push(
                { id: 4, slotTime: "2024-07-27T11:00:00", slotStatus: SlotStatus.Pending, donorId: 4, centerId: selectedCenter.id },
                { id: 5, slotTime: "2024-07-27T12:00:00", slotStatus: SlotStatus.Pending, donorId: 5, centerId: selectedCenter.id },
                { id: 6, slotTime: "2024-07-27T13:00:00", slotStatus: SlotStatus.Pending, donorId: 6, centerId: selectedCenter.id }
            );
          }

          if (completed.length === 0) {
            completed.push(
                { id: 7, slotTime: "2024-07-27T14:00:00", slotStatus: SlotStatus.BloodReceived, donorId: 7, centerId: selectedCenter.id },
                { id: 8, slotTime: "2024-07-27T15:00:00", slotStatus: SlotStatus.BloodReceived, donorId: 8, centerId: selectedCenter.id },
                { id: 9, slotTime: "2024-07-27T16:00:00", slotStatus: SlotStatus.BloodReceived, donorId: 9, centerId: selectedCenter.id }
            );
          }

          setOngoingSlots(ongoing);
          setPendingSlots(pending);
          setCompletedSlots(completed);
        } catch (error) {
          console.error("Error fetching slots", error);
          // Add test data if there's an error
          setOngoingSlots([
            { id: 1, slotTime: "2024-07-27T08:00:00", slotStatus: SlotStatus.BloodAccepted, donorId: 1, centerId: selectedCenter?.id || 0 },
            { id: 2, slotTime: "2024-07-27T09:00:00", slotStatus: SlotStatus.BloodRejected, donorId: 2, centerId: selectedCenter?.id || 0 },
            { id: 3, slotTime: "2024-07-27T10:00:00", slotStatus: SlotStatus.DonorNotArrived, donorId: 3, centerId: selectedCenter?.id || 0 }
          ]);

          setPendingSlots([
            { id: 4, slotTime: "2024-07-27T11:00:00", slotStatus: SlotStatus.Pending, donorId: 4, centerId: selectedCenter?.id || 0 },
            { id: 5, slotTime: "2024-07-27T12:00:00", slotStatus: SlotStatus.Pending, donorId: 5, centerId: selectedCenter?.id || 0 },
            { id: 6, slotTime: "2024-07-27T13:00:00", slotStatus: SlotStatus.Pending, donorId: 6, centerId: selectedCenter?.id || 0 }
          ]);

          setCompletedSlots([
            { id: 7, slotTime: "2024-07-27T14:00:00", slotStatus: SlotStatus.BloodReceived, donorId: 7, centerId: selectedCenter?.id || 0 },
            { id: 8, slotTime: "2024-07-27T15:00:00", slotStatus: SlotStatus.BloodReceived, donorId: 8, centerId: selectedCenter?.id || 0 },
            { id: 9, slotTime: "2024-07-27T16:00:00", slotStatus: SlotStatus.BloodReceived, donorId: 9, centerId: selectedCenter?.id || 0 }
          ]);
        }
      };

      fetchSlots();
    }
  }, [selectedCenter]);

  const handleStatusChange = async (slotId: number, newStatus: SlotStatus) => {
    try {
      await axios.put(`/DonationSlot/update`, {
        id: slotId,
        slotStatus: newStatus,
      });
      // Update local state after successful update
      setPendingSlots((prev) =>
          prev.map((slot) =>
              slot.id === slotId ? { ...slot, slotStatus: newStatus } : slot
          )
      );
    } catch (error) {
      console.error("Error updating slot status", error);
    }
  };

  return (
      <div>
        <h2>Ongoing Slots</h2>
        <ul>
          {ongoingSlots.map((slot) => (
              <li key={slot.id}>{slot.slotTime}</li>
          ))}
        </ul>

        <h2>Pending Slots</h2>
        <ul>
          {pendingSlots.map((slot) => (
              <li key={slot.id}>
                {slot.slotTime}
                <select
                    value={slot.slotStatus}
                    onChange={(e) =>
                        handleStatusChange(slot.id, e.target.value as SlotStatus)
                    }
                >
                  {Object.values(SlotStatus).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                  ))}
                </select>
              </li>
          ))}
        </ul>

        <h2>Completed Slots</h2>
        <ul>
          {completedSlots.map((slot) => (
              <li key={slot.id}>{slot.slotTime}</li>
          ))}
        </ul>
      </div>
  );
};

export default Donations;

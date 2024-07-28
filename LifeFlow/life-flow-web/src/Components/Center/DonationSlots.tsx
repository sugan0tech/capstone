import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCenter } from "../../contexts/CenterContext";

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

const DonationSlots: React.FC = () => {
  const { selectedCenter } = useCenter();
  const [ongoingSlots, setOngoingSlots] = useState<DonationSlot[]>([]);
  const [pendingSlots, setPendingSlots] = useState<DonationSlot[]>([]);

  useEffect(() => {
    if (selectedCenter) {
      const fetchSlots = async () => {
        try {
          const response = await axios.get<DonationSlot[]>(
            `/DonationSlot/all/${selectedCenter.id}`
          );
          const ongoing = response.data.filter(
            (slot) => slot.slotStatus !== SlotStatus.Pending
          );
          const pending = response.data.filter(
            (slot) => slot.slotStatus === SlotStatus.Pending
          );
          setOngoingSlots(ongoing);
          setPendingSlots(pending);
        } catch (error) {
          console.error("Error fetching slots", error);
        }
      };

      fetchSlots();
    }
  }, [selectedCenter]);

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
          <li key={slot.id}>{slot.slotTime}</li>
        ))}
      </ul>
    </div>
  );
};

export default DonationSlots;

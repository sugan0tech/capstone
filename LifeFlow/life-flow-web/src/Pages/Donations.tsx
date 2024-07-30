import React, { useEffect, useState } from "react";
import { useCenter } from "../contexts/CenterContext";
import {get, put} from "../utils/apiService.ts";

export interface DonationSlot {
  id: number;
  slotTime: string;
  slotStatus: SlotStatus;
  donorId: number;
  centerId: number;
}

export interface UserDto {
  id: number;
  email: string;
  name: string;
  phoneNumber: string;
  isVerified: boolean;
  loginAttempts: number;
  role: string;
}

export interface Donor {
  id: number;
  userId: number;
  bloodAntigenType: string;
  bloodSubtype: string;
  lastDonationTime: string | null;
  addressId: number;
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
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);

  useEffect(() => {
    if (selectedCenter) {
      const fetchSlots = async () => {
        try {
          const slots = await get<DonationSlot[]>(
              `/DonationSlot/all/${selectedCenter.id}`
          );

          const ongoing = slots.filter(
              (slot) => slot.slotStatus === SlotStatus.Pending
          );
          const pending = slots.filter(
              (slot) =>
                  slot.slotStatus === SlotStatus.BloodReceived
          );
          const completed = slots.filter(
              (slot) => slot.slotStatus === SlotStatus.BloodAccepted
          );

          setOngoingSlots(ongoing);
          setPendingSlots(pending);
          setCompletedSlots(completed);
        } catch (error) {
          console.error("Error fetching slots", error);
        }
      };

      fetchSlots();
    }
  }, [selectedCenter]);

  const handleStatusChange = async (slotId: number, newStatus: SlotStatus) => {
    try {
      await put<DonationSlot>(`/DonationSlot`, {
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

  const handleOpenModal = async (donorId: number) => {
    try {
      const donorResponse = await get<Donor>(`/Donor/id/${donorId}`);
      setSelectedDonor(donorResponse);

      const userResponse = await get<UserDto>(`/User/${donorResponse.userId}`);
      setSelectedUser(userResponse);

      document.getElementById('my_modal_5')?.showModal();
    } catch (error) {
      console.error("Error fetching donor/user information", error);
    }
  };

  return (
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold my-4">Ongoing Slots</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ongoingSlots.map((slot) => (
              <div key={slot.id} className="card bg-base-100 shadow-md p-4">
                <h3 className="text-lg font-semibold">{slot.slotTime}</h3>
                <p>Status: {slot.slotStatus}</p>
                <div className="dropdown dropdown-right">
                  <div tabIndex={0} role="button" className="btn m-1">
                    Change Status
                  </div>
                  <ul
                      tabIndex={0}
                      className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                  >
                    {Object.values(SlotStatus).map((status) => (
                        <li key={status}>
                          <a
                              onClick={() =>
                                  handleStatusChange(slot.id, status as SlotStatus)
                              }
                          >
                            {status}
                          </a>
                        </li>
                    ))}
                  </ul>
                </div>
              </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold my-4">Pending Slots</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pendingSlots.map((slot) => (
              <div key={slot.id} className="card bg-base-100 shadow-md p-4">
                <h3 className="text-lg font-semibold">{slot.slotTime}</h3>
                <p>Status: {slot.slotStatus}</p>
                <div className="dropdown dropdown-right">
                  <div tabIndex={0} role="button" className="btn m-1">
                    Change Status
                  </div>
                  <ul
                      tabIndex={0}
                      className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                  >
                    {Object.values(SlotStatus).map((status) => (
                        <li key={status}>
                          <a
                              onClick={() =>
                                  handleStatusChange(slot.id, status as SlotStatus)
                              }
                          >
                            {status}
                          </a>
                        </li>
                    ))}
                  </ul>
                </div>
              </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold my-4">Completed Slots</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {completedSlots.map((slot) => (
              <div key={slot.id} className="card bg-base-100 shadow-md p-4">
                <h3 className="text-lg font-semibold">{slot.slotTime}</h3>
                <p>Status: {slot.slotStatus}</p>
                <button
                    className="btn mt-2"
                    onClick={() => handleOpenModal(slot.donorId)}
                >
                  View Donor Info
                </button>
              </div>
          ))}
        </div>

        <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Donor Information</h3>
            {selectedDonor && selectedUser && (
                <div>
                  <p>Donor ID: {selectedDonor.id}</p>
                  <p>Name: {selectedUser.name}</p>
                  <p>Email: {selectedUser.email}</p>
                  <p>Phone: {selectedUser.phoneNumber}</p>
                  <p>Blood Type: {selectedDonor.bloodAntigenType}</p>
                  <p>Blood Subtype: {selectedDonor.bloodSubtype}</p>
                </div>
            )}
            <div className="modal-action">
              <form method="dialog">
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
  );
};

export default Donations;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../contexts/AlertContext";
import { post } from "../utils/apiService";
import { Donor, useAuth } from "../contexts/AuthContext";

type BloodSubtype = "Rhd" | "Ro";
type AntigenType =
  | "APositive"
  | "ANegative"
  | "BPositive"
  | "BNegative"
  | "OPositive"
  | "ONegative"
  | "ABPositive"
  | "ABNegative";

function CreateDonor() {
  const [bloodAntigenType, setBloodAntigenType] =
    useState<AntigenType>("APositive");
  const [bloodSubtype, setBloodSubtype] = useState<BloodSubtype>("Rhd");
  const [lastDonationTime, setLastDonationTime] = useState<Date | null>(null);
  const [addressId, setAddressId] = useState<number | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);
  const [acknowledgedNoDrugs, setAcknowledgedNoDrugs] = useState(false);
  const navigate = useNavigate();
  const { addAlert } = useAlert();
  const { user } = useAuth();

  const handleCreateDonor = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!acknowledged || !acknowledgedNoDrugs) {
      addAlert({
        message: "Please Acknoweledge the terms",
        type: "warning",
      });
      return;
    }
    const responsePromise = post<Donor>("/Donor", {
      userId: user?.id,
      bloodAntigenType: bloodAntigenType,
      bloodSubtype: bloodSubtype,
      lastDonationTime: lastDonationTime,
    });
    responsePromise.catch((e) => {
      addAlert({
        message: "Failed to create donor profile. Please try again. ",
        type: "warning",
      });
      console.log(e);
    });
    responsePromise.then((value) => {
      localStorage.setItem("Donor", JSON.stringify(value));

      addAlert({
        message: "Donor profile created successfully!",
        type: "success",
      });
      navigate("/home");
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">What is BloodType?</span>
        </div>
        <select
          className="select select-bordered w-full max-w-xs"
          value={bloodAntigenType}
          onChange={(e) => setBloodAntigenType(e.target.value as AntigenType)}
        >
          <option disabled selected>
            Blood Antigen Type
          </option>
          <option value="APositive">A Positive</option>
          <option value="ANegative">A Negative</option>
          <option value="BPositive">B Positive</option>
          <option value="BNegative">B Negative</option>
          <option value="OPositive">O Positive</option>
          <option value="ONegative">O Negative</option>
          <option value="ABPositive">AB Positive</option>
          <option value="ABNegative">AB Negative</option>
        </select>
      </label>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">What is your Blood SubType?</span>
        </div>
        <select
          className="select select-bordered w-full max-w-xs"
          value={bloodSubtype}
          onChange={(e) => setBloodSubtype(e.target.value as BloodSubtype)}
        >
          <option disabled selected>
            Blood Subtype
          </option>
          <option value="Rhd">Rhd</option>
          <option value="Ro">Ro</option>
        </select>
      </label>
      <label className="input input-bordered flex items-center gap-2">
        <div className="label">
          <span className="label-text">Last donation time</span>
        </div>
        <input
          type="date"
          value={
            lastDonationTime
              ? lastDonationTime.toISOString().substring(0, 10)
              : ""
          }
          onChange={(e) =>
            setLastDonationTime(
              e.target.value ? new Date(e.target.value) : null
            )
          }
        />
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={acknowledged}
          onChange={(e) => setAcknowledged(e.target.checked)}
          className="checkbox checkbox-secondary"
        />
        <span>
          I acknowledge that I have no disqualifying diseases & conditions
        </span>
        <button
          className="btn btn-sm"
          onClick={() => document.getElementById("diseases_modal").showModal()}
        >
          Read More
        </button>
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={acknowledgedNoDrugs}
          onChange={(e) => setAcknowledgedNoDrugs(e.target.checked)}
          className="checkbox checkbox-secondary"
        />
        <span>
          I acknowledge that I will not consume alcohol within 24 hours before
          the time of donation.
        </span>
      </label>
      <div className="form-control gap-2">
        <button className="btn btn-accent" onClick={handleCreateDonor}>
          Create Donor
        </button>
      </div>

      <dialog
        id="diseases_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Disqualifying Diseases & Conditions
          </h3>
          <p className="py-4">
            You cannot donate blood if you have any of the following diseases:
            <ul>
              <li>Malaria (within the past 4 months)</li>
              <li>HIV</li>
              <li>Hepatitis</li>
            </ul>
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default CreateDonor;

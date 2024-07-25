import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthHook from "../hooks/useAuthHook";
import { useAlert } from "../contexts/AlertContext";
import EmailLogo from "../assets/EmailLogo";
import MobileSvg from "../assets/MobileSvg";
import PasswordSvg from "../assets/PasswordSvg";
import { PersonSvg } from "../assets/PersonSvg";

type Role = "Donor" | "HospitalAdmin" | "CenterAdmin" | "PharmaAdmin";
function Register() {
  const { register, verifyOtp } = useAuthHook();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>("Donor");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();
  const { addAlert } = useAlert();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      addAlert({ message: "Passwords do not match.", type: "warning" });
      return;
    }
    try {
      await register(email, username, phone, password, role);
      addAlert({
        message:
          "Registration successful! Please enter the OTP sent to your email.",
        type: "success",
      });
      setIsOtpSent(true);
    } catch (error) {
      addAlert({
        message: "Registration failed. Please try again." + error,
        type: "warning",
      });
      console.log(error);
    }
  };

  const handleOtpSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await verifyOtp(email, otp);
      addAlert({
        message: "Verification successful! Redirecting to home.",
        type: "success",
      });
      navigate("/home");
    } catch (error) {
      addAlert({
        message: "OTP verification failed. Please try again." + error,
        type: "warning",
      });
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {!isOtpSent ? (
        <>
          <label className="input input-bordered flex items-center gap-2">
            <EmailLogo />
            <input
              type="text"
              className="grow"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <PersonSvg />
            <input
              type="text"
              className="grow"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <MobileSvg />
            <input
              type="number"
              className="grow"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <PasswordSvg />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <PasswordSvg />
            <input
              type="password"
              className="grow"
              placeholder="Retype Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>
          <select
            className="select select-bordered w-full max-w-72"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
          >
            <option disabled selected value="Donor">
              Purpose
            </option>
            <option value="Donor">Donor</option>
            <option value="HospitalAdmin">BloodRequest - Hospital</option>
            <option value="PharmaAdmin">BloodRequest - Pharma</option>
          </select>
          <div className="form-control gap-2">
            <button className="btn btn-accent" onClick={handleRegister}>
              Register
            </button>
          </div>
        </>
      ) : (
        <>
          <label className="input input-bordered flex items-center gap-2">
            <input
              type="text"
              className="grow"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </label>
          <div className="form-control gap-2">
            <button className="btn btn-accent" onClick={handleOtpSubmit}>
              Submit OTP
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Register;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useAuthHook from "../hooks/useAuthHook";
import { useAlert } from "../contexts/AlertContext";
import EmailLogo from "../assets/EmailLogo";
import MobileSvg from "../assets/MobileSvg";
import PasswordSvg from "../assets/PasswordSvg";
import { PersonSvg } from "../assets/PersonSvg";

type Role = "Donor" | "HospitalAdmin" | "CenterAdmin" | "PharmaAdmin";

function Register() {
  const { t } = useTranslation();
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
      addAlert({ message: t("register.alert_password_mismatch"), type: "warning" });
      return;
    }
    try {
      await register(email, username, phone, password, role);
      addAlert({
        message: t("register.alert_registration_success"),
        type: "success",
      });
      setIsOtpSent(true);
    } catch (error) {
      addAlert({
        message: t("register.alert_registration_fail") + error,
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
        message: t("register.alert_verification_success"),
        type: "success",
      });
      navigate("/home");
    } catch (error) {
      addAlert({
        message: t("register.alert_otp_fail") + error,
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
                    placeholder={t("register.email_placeholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <PersonSvg />
                <input
                    type="text"
                    className="grow"
                    placeholder={t("register.username_placeholder")}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <MobileSvg />
                <input
                    type="number"
                    className="grow"
                    placeholder={t("register.phone_placeholder")}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <PasswordSvg />
                <input
                    type="password"
                    className="grow"
                    placeholder={t("register.password_placeholder")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <PasswordSvg />
                <input
                    type="password"
                    className="grow"
                    placeholder={t("register.confirm_password_placeholder")}
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
                  {t("register.role_label")}
                </option>
                <option value="Donor">{t("register.donor")}</option>
                <option value="HospitalAdmin">{t("register.hospital_admin")}</option>
                <option value="PharmaAdmin">{t("register.pharma_admin")}</option>
              </select>
              <div className="form-control gap-2">
                <button className="btn btn-accent" onClick={handleRegister}>
                  {t("register.register_button")}
                </button>
              </div>
            </>
        ) : (
            <>
              <label className="input input-bordered flex items-center gap-2">
                <input
                    type="text"
                    className="grow"
                    placeholder={t("register.otp_placeholder")}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />
              </label>
              <div className="form-control gap-2">
                <button className="btn btn-accent" onClick={handleOtpSubmit}>
                  {t("register.submit_otp_button")}
                </button>
              </div>
            </>
        )}
      </div>
  );
}

export default Register;

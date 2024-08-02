import { useState } from "react";
import { useTranslation } from "react-i18next";

export const ResetPassword = ({ onSave, onCancel }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordLength, setPasswordLength] = useState(true);
  const { t } = useTranslation();

  const handleCurrentPasswordChange = (e) => {
    setCurrentPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    setPasswordLength(value.length >= 8);
    setPasswordMatch(value === confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordMatch(newPassword === value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwordMatch && passwordLength) {
      onSave({ currentPassword, newPassword });
    }
  };

  return (
      <form onSubmit={handleSubmit}>
        <div className="form-control">
          <label className="label">{t("resetPassword.currentPassword")}</label>
          <input
              type="password"
              name="currentPassword"
              className="input input-bordered"
              value={currentPassword}
              onChange={handleCurrentPasswordChange}
              required
          />
        </div>
        <div className="form-control">
          <label className="label">{t("resetPassword.newPassword")}</label>
          <input
              type="password"
              name="newPassword"
              className="input input-bordered"
              value={newPassword}
              onChange={handleNewPasswordChange}
              required
          />
          {!passwordLength && (
              <p className="text-error">{t("resetPassword.passwordLengthError")}</p>
          )}
        </div>
        <div className="form-control">
          <label className="label">{t("resetPassword.confirmPassword")}</label>
          <input
              type="password"
              name="confirmPassword"
              className="input input-bordered"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
          />
          {!passwordMatch && (
              <p className="text-error">{t("resetPassword.passwordMatchError")}</p>
          )}
        </div>
        <div className="flex justify-between mt-4">
          <button type="submit" className="btn btn-secondary">
            {t("resetPassword.saveButton")}
          </button>
          <button type="button" className="btn btn-error" onClick={onCancel}>
            {t("resetPassword.cancelButton")}
          </button>
        </div>
      </form>
  );
};

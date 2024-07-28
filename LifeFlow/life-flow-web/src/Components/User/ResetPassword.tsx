import { useState } from "react";

export const ResetPassword = ({ onSave, onCancel }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordLength, setPasswordLength] = useState(true);

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
        <label className="label">Current Password</label>
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
        <label className="label">New Password</label>
        <input
          type="password"
          name="newPassword"
          className="input input-bordered"
          value={newPassword}
          onChange={handleNewPasswordChange}
          required
        />
        {!passwordLength && (
          <p className="text-error">
            Password must be at least 8 characters long
          </p>
        )}
      </div>
      <div className="form-control">
        <label className="label">Confirm New Password</label>
        <input
          type="password"
          name="confirmPassword"
          className="input input-bordered"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          required
        />
        {!passwordMatch && <p className="text-error">Passwords do not match</p>}
      </div>
      <div className="flex justify-between mt-4">
        <button type="submit" className="btn btn-secondary">
          Save
        </button>
        <button type="button" className="btn btn-error" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

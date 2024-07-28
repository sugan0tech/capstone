import { useState } from "react";

export const DonorInfoEdit = ({ donorInfo, onSave, onCancel }) => {
  const [formState, setFormState] = useState(donorInfo);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formState);
  };
  console.log(formState);

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-control">
        <label className="label">Blood Antigen Type</label>
        <input
          type="text"
          name="bloodAntigenType"
          className="input input-bordered"
          value={formState?.bloodAntigenType}
          onChange={handleChange}
        />
      </div>
      <div className="form-control">
        <label className="label">Blood Subtype</label>
        <input
          type="text"
          name="bloodSubType"
          className="input input-bordered"
          value={formState?.bloodSubtype}
          onChange={handleChange}
        />
      </div>
      <div className="flex justify-between  mt-4">
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

import { useState } from "react";

export const EditClient = ({ client, onSave, onCancel }) => {
  const [formState, setFormState] = useState(client);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formState);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-control">
        <label className="label">Name</label>
        <input
          type="text"
          name="name"
          className="input input-bordered"
          value={formState?.name}
          onChange={handleChange}
        />
      </div>
      <div className="form-control">
        <label className="label">Type</label>
        <input
          type="text"
          name="type"
          className="input input-bordered"
          value={formState?.type}
          onChange={handleChange}
        />
      </div>
      {/* Add other fields as needed */}
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

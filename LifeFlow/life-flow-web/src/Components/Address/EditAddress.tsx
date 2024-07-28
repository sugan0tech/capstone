import { useState } from "react";

export const EditAddress = ({ address, onSave, onCancel }) => {
  const [formState, setFormState] = useState(address);

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
        <label className="label">Street</label>
        <input
          type="text"
          name="street"
          className="input input-bordered"
          value={formState?.street}
          onChange={handleChange}
        />
      </div>
      <div className="form-control">
        <label className="label">City</label>
        <input
          type="text"
          name="city"
          className="input input-bordered"
          value={formState?.city}
          onChange={handleChange}
        />
      </div>
      <div className="form-control">
        <label className="label">State</label>
        <input
          type="text"
          name="state"
          className="input input-bordered"
          value={formState?.state}
          onChange={handleChange}
        />
      </div>
      <div className="form-control">
        <label className="label">Country</label>
        <input
          type="text"
          name="country"
          className="input input-bordered"
          value={formState?.country}
          onChange={handleChange}
        />
      </div>
      <div className="form-control">
        <label className="label">Zip Code</label>
        <input
          type="text"
          name="zipCode"
          className="input input-bordered"
          value={formState?.zipCode}
          onChange={handleChange}
        />
      </div>
      <div className="form-control">
        <label className="label">Latitude</label>
        <input
          type="number"
          name="latitude"
          className="input input-bordered"
          value={formState?.latitude}
          onChange={handleChange}
          step="any"
        />
      </div>
      <div className="form-control">
        <label className="label">Longitude</label>
        <input
          type="number"
          name="longitude"
          className="input input-bordered"
          value={formState?.longitude}
          onChange={handleChange}
          step="any"
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

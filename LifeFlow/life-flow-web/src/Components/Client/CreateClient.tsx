import { useState, useEffect } from "react";
import { post } from "../../utils/apiService";

interface Client {
  id?: number; // Optional for new clients
  name: string;
  type: "Hospital" | "Pharma"; // Enum of "Hospital" or "Pharma"
  managedById: number;
  addressId?: number; // Optional
}

export const CreateClient = ({ onSave, onCancel, currentUserId }) => {
  const [formState, setFormState] = useState<Client>({
    name: "",
    type: "",
    managedById: currentUserId,
  });

  const [userRole, setUserRole] = useState<
    "HospitalAdmin" | "PharmaAdmin" | null
  >(null);

  useEffect(() => {
    // Assume there's a function to get the user role
    const fetchUserRole = async () => {
      // Example: const role = await getUserRole();
      const role = "HospitalAdmin"; // Replace this with actual role fetching logic
      setUserRole(role);
    };
    fetchUserRole();
  }, []);

  useEffect(() => {
    if (userRole) {
      setFormState((prevState) => ({
        ...prevState,
        type: userRole === "HospitalAdmin" ? "Hospital" : "Pharma",
      }));
    }
  }, [userRole]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await post<Client>("client", formState);
      onSave(response);
    } catch (error) {
      console.error("Error creating client:", error);
      // Handle errors appropriately, e.g., display error messages
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-control">
        <label className="label">Name</label>
        <input
          type="text"
          name="name"
          className="input input-bordered"
          value={formState.name}
          onChange={handleChange}
        />
      </div>
      {formState.type === "" && (
        <div className="form-control">
          <label className="label">Type</label>
          <select
            name="type"
            className="select select-bordered"
            onChange={handleChange}
            value={formState.type}
          >
            <option value="Hospital">Hospital</option>
            <option value="Pharma">Pharma</option>
          </select>
        </div>
      )}
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

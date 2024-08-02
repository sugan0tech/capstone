import { useState } from "react";
import { post } from "../../utils/apiService";
import { Center} from "../../contexts/CenterContext.tsx";

const AddCenter = () => {
  const [newCenter, setNewCenter] = useState<Center>({
    id: 0,
    name: "",
    latitude: 0,
    longitude: 0,
    unitsCapacity: 0,
    rbcUnits: 0,
    plateletsUnits: 0,
    plasmaUnits: 0,
    isCentralReserve: false,
    slotsCapacity: 0,
    addressId: null,
    openByTime: "00:00:00",
    closeByTime: "00:00:00",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCenter((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await post("/BloodCenter", newCenter);
    document.getElementById('my_modal_1').close();
  };

  const handleCancel = () => {
    document.getElementById('my_modal_1').close();
  };

  return (
      <div>
        <button className="btn bg-primary" onClick={() => document.getElementById('my_modal_1').showModal()}>
          Add New Center
        </button>
        <dialog id="my_modal_1" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Add New Blood Center</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">Name</label>
                <input
                    type="text"
                    name="name"
                    className="input input-bordered"
                    value={newCenter.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                />
              </div>
              <div className="form-control">
                <label className="label">Latitude</label>
                <input
                    type="number"
                    name="latitude"
                    className="input input-bordered"
                    value={newCenter.latitude}
                    onChange={handleInputChange}
                    placeholder="Latitude"
                />
              </div>
              <div className="form-control">
                <label className="label">Longitude</label>
                <input
                    type="number"
                    name="longitude"
                    className="input input-bordered"
                    value={newCenter.longitude}
                    onChange={handleInputChange}
                    placeholder="Longitude"
                />
              </div>
              <div className="form-control">
                <label className="label">Units Capacity</label>
                <input
                    type="number"
                    name="unitsCapacity"
                    className="input input-bordered"
                    value={newCenter.unitsCapacity}
                    onChange={handleInputChange}
                    placeholder="Units Capacity"
                />
              </div>
              <div className="form-control">
                <label className="label">RBC Units</label>
                <input
                    type="number"
                    name="rbcUnits"
                    className="input input-bordered"
                    value={newCenter.rbcUnits}
                    onChange={handleInputChange}
                    placeholder="RBC Units"
                />
              </div>
              <div className="form-control">
                <label className="label">Platelets Units</label>
                <input
                    type="number"
                    name="plateletsUnits"
                    className="input input-bordered"
                    value={newCenter.plateletsUnits}
                    onChange={handleInputChange}
                    placeholder="Platelets Units"
                />
              </div>
              <div className="form-control">
                <label className="label">Plasma Units</label>
                <input
                    type="number"
                    name="plasmaUnits"
                    className="input input-bordered"
                    value={newCenter.plasmaUnits}
                    onChange={handleInputChange}
                    placeholder="Plasma Units"
                />
              </div>
              <div className="form-control">
                <label className="label">Central Reserve</label>
                <input
                    type="checkbox"
                    name="isCentralReserve"
                    className="checkbox"
                    checked={newCenter.isCentralReserve}
                    onChange={(e) =>
                        setNewCenter((prev) => ({
                          ...prev,
                          isCentralReserve: e.target.checked,
                        }))
                    }
                />
              </div>
              <div className="form-control">
                <label className="label">Slots Capacity</label>
                <input
                    type="number"
                    name="slotsCapacity"
                    className="input input-bordered"
                    value={newCenter.slotsCapacity}
                    onChange={handleInputChange}
                    placeholder="Slots Capacity"
                />
              </div>
              <div className="form-control">
                <label className="label">Open By Time</label>
                <input
                    type="text"
                    name="openByTime"
                    className="input input-bordered"
                    value={newCenter.openByTime}
                    onChange={handleInputChange}
                    placeholder="Open By Time"
                />
              </div>
              <div className="form-control">
                <label className="label">Close By Time</label>
                <input
                    type="text"
                    name="closeByTime"
                    className="input input-bordered"
                    value={newCenter.closeByTime}
                    onChange={handleInputChange}
                    placeholder="Close By Time"
                />
              </div>
              <div className="flex justify-between mt-4">
                <button type="submit" className="btn btn-secondary">
                  Add Center
                </button>
                <button type="button" className="btn btn-error" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </div>
  );
};

export default AddCenter;

import React, { useState } from "react";
import { useCenter } from "../../contexts/CenterContext";
import { put } from "../../utils/apiService";

const CenterInfo: React.FC = () => {
    const { selectedCenter, setSelectedCenter } = useCenter();
    const [isEditing, setIsEditing] = useState(false);
    const [formState, setFormState] = useState(selectedCenter);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formState) {
            await put(`/BloodCenter/${formState.id}`, formState);
            setSelectedCenter(formState);
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setFormState(selectedCenter);
        setIsEditing(false);
    };

    return (
        <div className="flex flex-col pb-16 pt-16 ">
            {selectedCenter ? (
                <div className="card bg-base-300  shadow-lg h-fit rounded-btn">
                    <div className="card-body">
                        <h2 className="card-title">Center Details</h2>
                        {isEditing ? (
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
                                    <label className="label">Latitude</label>
                                    <input
                                        type="number"
                                        name="latitude"
                                        className="input input-bordered"
                                        value={formState?.latitude}
                                        onChange={handleChange}
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
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">Units Capacity</label>
                                    <input
                                        type="number"
                                        name="unitsCapacity"
                                        className="input input-bordered"
                                        value={formState?.unitsCapacity}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">RBC Units</label>
                                    <input
                                        type="number"
                                        name="rbcUnits"
                                        className="input input-bordered"
                                        value={formState?.rbcUnits}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">Platelets Units</label>
                                    <input
                                        type="number"
                                        name="plateletsUnits"
                                        className="input input-bordered"
                                        value={formState?.plateletsUnits}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">Plasma Units</label>
                                    <input
                                        type="number"
                                        name="plasmaUnits"
                                        className="input input-bordered"
                                        value={formState?.plasmaUnits}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">Slots Capacity</label>
                                    <input
                                        type="number"
                                        name="slotsCapacity"
                                        className="input input-bordered"
                                        value={formState?.slotsCapacity}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">Open Time</label>
                                    <input
                                        type="time"
                                        name="openByTime"
                                        className="input input-bordered"
                                        value={formState?.openByTime}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">Close Time</label>
                                    <input
                                        type="time"
                                        name="closeByTime"
                                        className="input input-bordered"
                                        value={formState?.closeByTime}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex justify-between mt-4">
                                    <button type="submit" className="btn btn-secondary">
                                        Save
                                    </button>
                                    <button type="button" className="btn btn-error" onClick={handleCancel}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div>
                                <p>Name: {selectedCenter.name}</p>
                                <p>Latitude: {selectedCenter.latitude}</p>
                                <p>Longitude: {selectedCenter.longitude}</p>
                                <p>Units Capacity: {selectedCenter.unitsCapacity}</p>
                                <p>RBC Units: {selectedCenter.rbcUnits}</p>
                                <p>Platelets Units: {selectedCenter.plateletsUnits}</p>
                                <p>Plasma Units: {selectedCenter.plasmaUnits}</p>
                                <p>Slots Capacity: {selectedCenter.slotsCapacity}</p>
                                <p>Open Time: {selectedCenter.openByTime}</p>
                                <p>Close Time: {selectedCenter.closeByTime}</p>
                                <button
                                    className="btn btn-primary mt-4"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <p>No center selected.</p>
            )}
        </div>
    );
};

export default CenterInfo;

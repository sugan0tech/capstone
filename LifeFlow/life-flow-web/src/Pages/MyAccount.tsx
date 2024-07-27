import { useEffect, useState } from "react";
import {del, get, post} from "../utils/apiService";
import { useAuth, User } from "../contexts/AuthContext";

// Interfaces
export interface DonorInfo {
    id: number;
    userId: number;
    bloodAntigenType: string;
    bloodSubType: string;
    lastDonationTime: string;
    addressId: number;
}

export interface Device {
    sessionId: number;
    deviceType: string;
    isValid: boolean;
    lastActive: string;
}

function MyAccount() {
    const { user } = useAuth();
    const [donorInfo, setDonorInfo] = useState<DonorInfo | null>(null);
    const [isEditingDonor, setIsEditingDonor] = useState(false);
    const [isEditingUser, setIsEditingUser] = useState(false);
    const [devices, setDevices] = useState<Device[]>([]);

    useEffect(() => {
        const localDonor = localStorage.getItem("Donor");
        if (localDonor) {
            setDonorInfo(JSON.parse(localDonor));
        }

        const fetchDevices = async () => {
            const response = await get<Device[]>(`UserSession/`);
            setDevices(response);
        };

        fetchDevices();
    }, []);

    const handleUpdateDonorInfo = async (updatedInfo: DonorInfo) => {
        await post(`/api/donor/update`, updatedInfo);
        setDonorInfo(updatedInfo);
        localStorage.setItem("Donor", JSON.stringify(updatedInfo));
        setIsEditingDonor(false);
    };

    const handleUpdateUserInfo = async (updatedUser: User) => {
        await post(`/api/user/update`, updatedUser);
        setIsEditingUser(false);
    };

    const handleLogoutDevice = async (deviceId: number) => {
        await del("UserSession/" +  deviceId );
        setDevices(devices.filter(device => device.sessionId !== deviceId));
    };

    const handleLogoutAllDevices = async () => {
        await post("UserSession/invalidateAll" + user?.id);
        setDevices([]);
    };

    return (
        <div className="flex flex-col">
            <div className="flex flex-col gap-x-96 items-center bg-base-300 h-48 rounded-box lg:flex-row">
                <div className="flex-1 lg:pl-24">
                    <h1 className="text-2xl font-bold">My Account</h1>
                </div>
            </div>

            <div className="divider"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {user?.role === "Donor" && (
                    <div className="card bg-base-100 h-fit rounded-btn">
                        <div className="card-body">
                            <h2 className="card-title">Donor Information</h2>
                            {isEditingDonor ? (
                                <DonorEditForm
                                    donorInfo={donorInfo}
                                    onSave={handleUpdateDonorInfo}
                                    onCancel={() => setIsEditingDonor(false)}
                                />
                            ) : (
                                <DonorInfoDisplay
                                    donorInfo={donorInfo}
                                    onEdit={() => setIsEditingDonor(true)}
                                />
                            )}
                        </div>
                    </div>
                )}

                <div className="card bg-base-100 h-fit rounded-btn">
                    <div className="card-body">
                        <h2 className="card-title">User Account Information</h2>
                        {isEditingUser ? (
                            <UserEditForm
                                user={user}
                                onSave={handleUpdateUserInfo}
                                onCancel={() => setIsEditingUser(false)}
                            />
                        ) : (
                            <UserInfoDisplay
                                user={user}
                                onEdit={() => setIsEditingUser(true)}
                            />
                        )}
                        <button className="btn btn-secondary mt-4">Reset Password</button>
                    </div>
                </div>

                <div className="card bg-base-100 h-fit rounded-btn">
                    <div className="card-body">
                        <h2 className="card-title">Logged In Devices</h2>
                        <div className="overflow-y-scroll" style={{ maxHeight: "300px" }}>
                            {devices.map((device) => (
                                <div
                                    key={device.sessionId}
                                    className={`card bg-base-200 h-fit rounded-btn mb-2 ${
                                        device.isValid ? "border-2 border-primary" : ""
                                    }`}
                                >
                                    <div className="card-body">
                                        <h3 className="card-title">{device.deviceType}</h3>
                                        <p>Last Active: {device.lastActive}</p>
                                        <div className="card-actions justify-end">
                                            {!device.isValid && (
                                                <button
                                                    className="btn btn-secondary"
                                                    onClick={() => handleLogoutDevice(device.sessionId)}
                                                >
                                                    Logout Device
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            className="btn btn-primary mt-4"
                            onClick={handleLogoutAllDevices}
                        >
                            Logout All Devices
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Components for displaying and editing donor information
const DonorInfoDisplay = ({ donorInfo, onEdit }) => (
    <div>
        <p>Blood Antigen Type: {donorInfo?.bloodAntigenType}</p>
        <p>Blood Subtype: {donorInfo?.bloodSubType}</p>
        <p>Last Donation Time: {donorInfo?.lastDonationTime}</p>
        <button className="btn btn-secondary mt-4" onClick={onEdit}>
            Edit
        </button>
    </div>
);

const DonorEditForm = ({ donorInfo, onSave, onCancel }) => {
    const [formState, setFormState] = useState(donorInfo);

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
                    value={formState?.bloodSubType}
                    onChange={handleChange}
                />
            </div>
            <div className="form-control">
                <label className="label">Last Donation Time</label>
                <input
                    type="text"
                    name="lastDonationTime"
                    className="input input-bordered"
                    value={formState?.lastDonationTime}
                    onChange={handleChange}
                />
            </div>
            <div className="form-control mt-4">
                <button type="submit" className="btn btn-primary">
                    Save
                </button>
                <button
                    type="button"
                    className="btn btn-secondary ml-2"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

// Components for displaying and editing user information
const UserInfoDisplay = ({ user, onEdit }) => (
    <div>
        <p>Email: {user?.email}</p>
        <p>Name: {user?.name}</p>
        <p>Role: {user?.role}</p>
        <button className="btn btn-secondary mt-4" onClick={onEdit}>
            Edit
        </button>
    </div>
);

const UserEditForm = ({ user, onSave, onCancel }) => {
    const [formState, setFormState] = useState(user);

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
                <label className="label">Email</label>
                <input
                    type="email"
                    name="email"
                    className="input input-bordered"
                    value={formState?.email}
                    onChange={handleChange}
                />
            </div>
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
            <div className="form-control mt-4">
                <button type="submit" className="btn btn-primary">
                    Save
                </button>
                <button
                    type="button"
                    className="btn btn-secondary ml-2"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default MyAccount;

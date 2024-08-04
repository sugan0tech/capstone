import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext"; // Assuming you have an AuthContext for getting roles
import { get } from "../../utils/apiService"; // Utility to make API calls

interface DonorProps {
    userId: number;
    distance: string;
    bloodAntigenType: string;
    bloodSubType: string;
}

interface UserDetail {
    id: number;
    email: string;
    name: string;
    phoneNumber: string;
    isVerified: boolean;
    loginAttempts: number;
    role: string;
}

function DonorCard({
                       userId,
                       distance,
                       bloodAntigenType,
                       bloodSubType,
                   }: DonorProps) {
    const { user } = useAuth(); // Assuming useAuth gives you the authenticated user
    const [userDetails, setUserDetails] = useState<UserDetail | null>(null);

    const fetchUserDetails = async () => {
        try {
            const response = await get<UserDetail>(`https://donationservice.azurewebsites.net/api/User/${userId}`);
            setUserDetails(response);
            document.getElementById("userModal")?.showModal();
        } catch (error) {
            console.error("Failed to fetch user details:", error);
        }
    };

    return (
        <>
            <div className="card-body bg-base-100 h-fit rounded-btn">
                <h2 className="card-title">{bloodSubType}</h2>
                <p>
                    Located in {distance} from you.
                </p>
                <div className="flex gap-2">
                    <div className="badge badge-info">
                        {bloodAntigenType}
                    </div>
                </div>
                <div className="card-actions justify-end">
                    <button className="btn btn-primary" onClick={fetchUserDetails}>
                        Contact
                    </button>
                </div>
            </div>

            {/* Modal to display user details */}
            <dialog id="userModal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">User Details</h3>
                    {userDetails ? (
                        <div>
                            <p><strong>Name:</strong> {userDetails.name}</p>
                            <p><strong>Email:</strong> {userDetails.email}</p>
                            <p><strong>Phone:</strong> {userDetails.phoneNumber}</p>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                    <div className="modal-action">
                        <button className="btn" onClick={() => document.getElementById("userModal")?.close()}>
                            Close
                        </button>
                    </div>
                </div>
            </dialog>
        </>
    );
}

export default DonorCard;

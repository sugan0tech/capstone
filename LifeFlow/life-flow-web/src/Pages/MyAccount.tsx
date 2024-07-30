import { useState } from "react";
import { post, put} from "../utils/apiService";
import { useAuth, User } from "../contexts/AuthContext";
import { UserInfo } from "../Components/User/UserInfo";
import { EditUserInfo } from "../Components/User/EditUserInfo";
import { ResetPassword } from "../Components/User/ResetPassword";
import { DonorComponent } from "../Components/Donor/Donor";
import { AdminComponent } from "../Components/Admin/Admin";
import Client from "../Components/Client/Client";
import LoggedInDevices from "../Components/User/LoggedInDevices.tsx";

function MyAccount() {
  const { user } = useAuth();
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const handleUpdateUserInfo = async (updatedUser: User) => {
    await put(`/user`, updatedUser);
    setIsEditingUser(false);
  };

  const handleResetPassword = async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => {
    await post(`/user/resetPassword`, passwordData);
    setIsResettingPassword(false);
  };

  return (
    <div className="flex flex-col pb-24">
      <div className="flex flex-col gap-x-96 items-center bg-base-300 h-48 rounded-box lg:flex-row">
        <div className="flex-1 lg:pl-24">
          <h1 className="text-2xl font-bold">My Account</h1>
        </div>
      </div>

      <div className="divider"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card bg-base-300 h-fit rounded-btn">
          <div className="card-body">
            <h2 className="card-title">User Account Information</h2>
            {isEditingUser ? (
              <EditUserInfo
                user={user}
                onSave={handleUpdateUserInfo}
                onCancel={() => setIsEditingUser(false)}
              />
            ) : isResettingPassword ? (
              <ResetPassword
                onSave={handleResetPassword}
                onCancel={() => setIsResettingPassword(false)}
              />
            ) : (
              <>
                <UserInfo user={user} onEdit={() => setIsEditingUser(true)} />
                <button
                  className="btn btn-secondary mt-4"
                  onClick={() => setIsResettingPassword(true)}
                >
                  Reset Password
                </button>
              </>
            )}
          </div>
        </div>
        {user?.role === "Donor" && <DonorComponent />}
        {(user?.role === "PharmaAdmin" || user?.role === "HospitalAdmin") && (
          <Client />
        )}
        {user?.role === "Admin" && <AdminComponent />}
        <LoggedInDevices />
      </div>
    </div>
  );
}

export default MyAccount;

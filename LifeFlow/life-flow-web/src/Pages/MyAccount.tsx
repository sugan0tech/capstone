import { useEffect, useState } from "react";
import { post, put } from "../utils/apiService";
import { useAuth, User, Donor, Address } from "../contexts/AuthContext";
import { DonorInfoDisplay } from "../Components/Donor/DonorInfoDisplay";
import { DonorInfoEdit } from "../Components/Donor/DonorInfoEdit";
import { useAlert } from "../contexts/AlertContext";
import { EditAddress } from "../Components/Address/EditAddress";
import { ViewAddress } from "../Components/Address/ViewAddress";
import { UserInfo } from "../Components/User/UserInfo";
import { EditUserInfo } from "../Components/User/EditUserInfo";
import { ResetPassword } from "../Components/User/ResetPassword";
import LoggedInDevices from "../Components/User/LoggedInDevices";

export interface Address {}

function MyAccount() {
  const { user } = useAuth();
  const [donorInfo, setDonorInfo] = useState<Donor | null>(null);
  const [addressInfo, setAddressInfo] = useState<Address | null>(null);
  const [isEditingDonor, setIsEditingDonor] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const { addAlert } = useAlert();

  useEffect(() => {
    const localDonor = localStorage.getItem("Donor");
    const localAddress = localStorage.getItem("address");
    if (localDonor) {
      setDonorInfo(JSON.parse(localDonor));
      if (!localAddress) {
        addAlert({ message: "Please create a address", type: "warning" });
      } else {
        setAddressInfo(JSON.parse(localAddress));
      }
    } else {
      addAlert({ message: "Please create a donor profile", type: "error" });
    }
  }, []);

  const handleUpdateDonorInfo = async (updatedInfo: Donor) => {
    await put(`/donor`, updatedInfo);
    setDonorInfo(updatedInfo);
    localStorage.setItem("Donor", JSON.stringify(updatedInfo));
    setIsEditingDonor(false);
  };

  const handleUpdateAddressInfo = async (updatedInfo: Address) => {
    await put(`/Address`, updatedInfo);
    setAddressInfo(updatedInfo);
    localStorage.setItem("address", JSON.stringify(updatedInfo));
    setIsEditingAddress(false);
  };

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
    <div className="flex flex-col">
      <div className="flex flex-col gap-x-96 items-center bg-base-300 h-48 rounded-box lg:flex-row">
        <div className="flex-1 lg:pl-24">
          <h1 className="text-2xl font-bold">My Account</h1>
        </div>
      </div>

      <div className="divider"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {user?.role === "Donor" && (
          <div className="flex flex-col-2 bg-base-300 h-fit rounded-btn">
            <div className="card-body">
              <h2 className="card-title">Donor Information</h2>
              {isEditingDonor ? (
                <DonorInfoEdit
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
            <div className="card-body">
              <h2 className="card-title">Address Info</h2>
              {isEditingAddress ? (
                <EditAddress
                  address={addressInfo}
                  onSave={handleUpdateAddressInfo}
                  onCancel={() => setIsEditingAddress(false)}
                />
              ) : (
                <ViewAddress
                  address={addressInfo}
                  onEdit={() => setIsEditingAddress(true)}
                />
              )}
            </div>
          </div>
        )}

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

        <LoggedInDevices />
      </div>
    </div>
  );
}

export default MyAccount;

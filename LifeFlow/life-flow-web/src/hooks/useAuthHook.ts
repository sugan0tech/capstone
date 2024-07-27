import { useState } from "react";
import {
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
  verifyOtp as apiVerifyOtp,
  setAuthTokens, get,
} from "../utils/apiService";
import {Address, Donor, Role, User} from "../contexts/AuthContext.tsx";

interface AuthState {
  isAuthenticated: boolean;
  role: Role | null;
  user: User | null;
  address: Address | null;
}

const useAuthHook = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
    role: localStorage.getItem("accessToken")
      ? parseJwt(localStorage.getItem("accessToken")!)[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ]
      : null,
    user: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")!)
      : null,
    address: localStorage.getItem("address") ? JSON.parse(localStorage.getItem("address")!): null,
  });

  const login = async (
    email: string,
    password: string,
    staySigned: boolean
  ) => {
    try {
      const data = await apiLogin(email, password, staySigned);
      setAuthTokens(data.accessToken, data.refreshToken);
      const role = data.user.role;
      console.log(data.user)
      let address: Address
      if (role == "Donor"){
        const donor = await get<Donor>("Donor/" + data.user.userId)
        address = await get<Address>("Address/" + donor.addressId)
        localStorage.setItem("Donor", JSON.stringify(donor));
      }
      // const role = parseJwt(data.accessToken)[
      //     "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      //     ];
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("address", JSON.stringify(address));
      setAuthState({ isAuthenticated: true, role, user: data.user, address: address });
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("address");
      setAuthState({ isAuthenticated: false, role: null, user: null , address: null});
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const register = async (
    email: string,
    name: string,
    phoneNumber: string,
    password: string,
    role: "Donor" | "HospitalAdmin" | "CenterAdmin" | "PharmaAdmin"
  ) => {
    try {
      await apiRegister({ email, name, phoneNumber, password, role });
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      await apiVerifyOtp(email, otp);
      // setAuthTokens(data.accessToken, data.refreshToken);
      // const role:Role = data.user.role as Role;
      // // const role = parseJwt(data.accessToken)[
      // //     "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      // //     ];
      // localStorage.setItem("user", JSON.stringify(data.user));
      // localStorage.setItem("isAuthenticated", "true");
      // setAuthState({ isAuthenticated: true, role, user: data.user });
    } catch (error) {
      console.error("OTP verification failed:", error);
      throw error;
    }
  };

  return { authState, login, logout, register, verifyOtp };
};

function parseJwt(token: string): never {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );

  return JSON.parse(jsonPayload);
}

export default useAuthHook;

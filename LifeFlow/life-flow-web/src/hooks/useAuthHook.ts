import { useState } from "react";
import { get, logout as apiLogout, setAuthTokens } from "../utils/apiService";
import {
  login as apiLogin,
  register as apiRegister,
  verifyOtp as apiVerifyOtp,
} from "../utils/authApiService";
import {Address, Client, Donor, Role, User} from "../contexts/AuthContext.tsx";
import axios from "axios";

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
    address: localStorage.getItem("address")
      ? JSON.parse(localStorage.getItem("address")!)
      : null,
  });

  const login = async (
    email: string,
    password: string,
    staySigned: boolean
  ) => {
    let data;
    try {
      data = await apiLogin(email, password, staySigned);
    } catch (error) {
      console.error("Login failed:", error);
      if (axios.isAxiosError(error) && error.response) {
        throw {
          status: error.response.status,
          message: error.response.data.message || "Login failed",
          data: error.response.data,
        };
      }

      throw error;
    }

    setAuthTokens(data.accessToken, data.refreshToken);
    const role = data.user.role;
    console.log(data.user);
    let address: Address | null = null;
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("isAuthenticated", "true");
    setAuthState((currState) => {
      console.log("inside");
      console.log(authState);
      return {
        ...currState,
        isAuthenticated: true,
        role,
        user: data.user,
        address: address,
      };
    });
    console.log(authState);
    if (role == "Donor") {
      try {
        const donor = await get<Donor>("Donor/" + data.user.id);
        localStorage.setItem("Donor", JSON.stringify(donor));
        address = await get<Address>("Address/" + donor.addressId);
        localStorage.setItem("address", JSON.stringify(address));
      } catch (error) {
        console.error(error);
        return error;
      }
    }
    else if ( role == "HospitalAdmin" || role == "PharmaAdmin" ){
      try {
        const client = await get<Client>("Client/user/" + data.user.id);
        localStorage.setItem("Client", JSON.stringify(client))
        address = await get<Address>("Address/" + client.addressId);
        localStorage.setItem("address", JSON.stringify(address));
      } catch (error) {
        console.error(error);
        return error;
      }
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
      localStorage.clear();
      location.reload();
      setAuthState({
        isAuthenticated: false,
        role: null,
        user: null,
        address: null,
      });
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
    } catch (error) {
      console.error("OTP verification failed:", error);
      throw error;
    }
  };

  return { authState, setAuthState, login, logout, register, verifyOtp };
};

function parseJwt(token: string): any {
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

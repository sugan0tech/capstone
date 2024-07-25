import { useState } from "react";
import {
  login as apiLogin,
  logout as apiLogout,
  setAuthTokens,
} from "../utils/apiService";

interface AuthState {
  isAuthenticated: boolean;
  role: string | null;
}

const useAuthHook = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
    role: localStorage.getItem("accessToken")
      ? parseJwt(localStorage.getItem("accessToken")!)[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ]
      : null,
  });

  const login = async (
    email: string,
    password: string,
    staySigned: boolean
  ) => {
    try {
      const data = await apiLogin(email, password, staySigned);
      setAuthTokens(data.accessToken, data.refreshToken);
      const role = parseJwt(localStorage.getItem("accessToken")!)[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ];
      setAuthState({ isAuthenticated: true, role });
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
      setAuthState({ isAuthenticated: false, role: null });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return { authState, login, logout };
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

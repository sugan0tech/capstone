import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import useAuthHook from "../hooks/useAuthHook";

export type Role =  "Donor" | "HospitalAdmin" | "CenterAdmin" | "PharmaAdmin" | "Admin";
export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  role: string | null;
  login: (email: string, password: string, staySigned: boolean) => Promise<void>;
  logout: () => void;
  register: (email: string, name: string, phone: string, password: string, role: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { authState, login, logout, register, verifyOtp } = useAuthHook();
  const [isAuthenticated, setIsAuthenticated] = useState(authState.isAuthenticated);
  const [user, setUser] = useState<User | null>(authState.user);
  const [role, setRole] = useState<string | null>(authState.role);

  useEffect(() => {
    setIsAuthenticated(authState.isAuthenticated);
    setUser(authState.user);
    setRole(authState.role);
  }, [authState]);

  return (
      <AuthContext.Provider value={{ user, isAuthenticated, role, login, logout, register, verifyOtp }}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

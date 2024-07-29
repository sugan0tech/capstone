import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import useAuthHook from "../hooks/useAuthHook";
import { Simulate } from "react-dom/test-utils";
import compositionStart = Simulate.compositionStart;

export type Role =
  | "Donor"
  | "HospitalAdmin"
  | "CenterAdmin"
  | "PharmaAdmin"
  | "Admin";
export interface User {
  id: number;
  email: string;
  phoneNumber: string;
  name: string;
  role: Role;
}

export interface Donor {
  id: number;
  userId: number;
  bloodAntigenType: string;
  bloodSubType: string;
  lastDonationTime: string;
  addressId: number;
}

export interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  zipcode: string;
  latitude: string;
  longitude: string;
  entityId: number;
  entityType: string;
}
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  address: Address | null;
  role: string | null;
  login: (
    email: string,
    password: string,
    staySigned: boolean
  ) => Promise<void>;
  logout: () => void;
  register: (
    email: string,
    name: string,
    phone: string,
    password: string,
    role: string
  ) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { authState, setAuthState, login, logout, register, verifyOtp } =
    useAuthHook();
  const [isAuthenticated, setIsAuthenticated] = useState(
    authState.isAuthenticated
  );
  const [user, setUser] = useState<User | null>(authState.user);
  const [role, setRole] = useState<string | null>(authState.role);
  const [address, setAddress] = useState<Address | null>(authState.address);

  useEffect(() => {
    setIsAuthenticated(authState.isAuthenticated);
    setUser(authState.user);
    setRole(authState.role);
    setAddress(authState.address);
    setAuthState(authState);
  }, [authState, setAuthState]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        address,
        role,
        login,
        logout,
        register,
        verifyOtp,
      }}
    >
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

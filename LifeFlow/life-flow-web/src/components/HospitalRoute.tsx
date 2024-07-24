import { useAuth } from "@/contexts/Authcontext";
import { Navigate } from "react-router-dom";

interface Props {
  children: JSX.Element;
}

function HospitalRoute({ children }: Props) {
  const { user } = useAuth();
  console.log("Hospital route validation");
  return user ? children : <Navigate to="/not-found" />;
}

export default HospitalRoute;

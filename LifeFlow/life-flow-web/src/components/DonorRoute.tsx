import { useAuth } from "@/contexts/Authcontext";
import { Navigate } from "react-router-dom";

interface Props {
  children: JSX.Element;
}

function DonorRoute({ children }: Props) {
  const { user } = useAuth();
  console.log("Donor route validation");
  return user ? children : <Navigate to="/not-found" />;
}

export default DonorRoute;

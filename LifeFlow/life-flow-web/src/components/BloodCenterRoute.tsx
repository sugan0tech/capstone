import { useAuth } from "@/contexts/Authcontext";
import { Navigate } from "react-router-dom";

interface Props {
  children: JSX.Element;
}

function BloodCenterRoute({ children }: Props) {
  const { user } = useAuth();
  console.log("BloodCenter route validation");
  return user ? children : <Navigate to="/not-found" />;
}

export default BloodCenterRoute;

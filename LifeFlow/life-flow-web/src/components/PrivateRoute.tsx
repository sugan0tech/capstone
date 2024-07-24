import { useAuth } from "@/contexts/Authcontext";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: JSX.Element;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const { user } = useAuth();
  console.log("yaaru pa nee");
  return user ? children : <Navigate to="/login" />;
}

export default PrivateRoute;

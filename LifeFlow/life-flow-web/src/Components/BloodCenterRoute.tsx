import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface Props {
  children: JSX.Element;
}

function BloodCenterRoute({ children }: Props) {
  const { user } = useAuth();
  console.log("BloodCenter route validation");
  return user ? children : <Navigate to="/not-found" />;
}

export default BloodCenterRoute;

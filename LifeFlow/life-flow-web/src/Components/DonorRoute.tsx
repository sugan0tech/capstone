import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface Props {
  children: JSX.Element;
}

function DonorRoute({ children }: Props) {
  const { user } = useAuth();
  if (localStorage.getItem("Donor") == null) {
    <Navigate to="/create-donor" />;
  }
  console.log("Donor route validation");
  return user ? children : <Navigate to="/not-found" />;
}

export default DonorRoute;

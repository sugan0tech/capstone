import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface Props {
  children: JSX.Element;
}

function AuthenticatedRoute({ children }: Props) {
  const { user } = useAuth();
  console.log("yaaru pa nee");
  return user ? children : <Navigate to="/login" />;
}

export default AuthenticatedRoute;

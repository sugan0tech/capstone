import { Navigate, useLocation, useRoutes } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface Props {
  children: JSX.Element;
}

function AuthenticatedRoute({ children }: Props) {
  const { user } = useAuth();
  const location = useLocation();
  if (user == null) {
    return <Navigate to="/login" />;
  }

  if (location.pathname == "/login" || location.pathname == "/register") {
    return <Navigate to="/home" />;
  }

  return children;
}

export default AuthenticatedRoute;

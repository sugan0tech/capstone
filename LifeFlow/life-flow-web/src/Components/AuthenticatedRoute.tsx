import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Login from "../Pages/Login";
import Register from "../Pages/Register";

interface Props {
  children: JSX.Element;
}

function AuthenticatedRoute({ children }: Props) {
  const { user } = useAuth();
  const location = useLocation();
  if (user == null) {
    // return <Navigate to={location.pathname} />;
    // s
    switch (location.pathname) {
      case "/login":
        return <Login />;
      case "/register":
        return <Register />;
    }
  }

  if (location.pathname == "/login" || location.pathname == "/register") {
    return <Navigate to="/home" />;
  }

  return children;
}

export default AuthenticatedRoute;

import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import React from "react";
import {useAlert} from "../contexts/AlertContext.tsx";

interface Props {
  children: JSX.Element;
}

function ClientRoute({ children }: Props) {
  const { user } = useAuth();
  const {addAlert } = useAlert();
  if(localStorage.getItem("Client") == null){
    addAlert({message: "Create Client Profile first", type: "error"})
    return <Navigate to="/my-account" />;
  }
  if(localStorage.getItem("address") == null){
    addAlert({message: "Create Address for client", type: "error"})
    return <Navigate to="/my-account" />;
  }
  console.log("Hospital/Pharma route validation");
  return user ? children : <Navigate to="/not-found" />;
}

export default ClientRoute;

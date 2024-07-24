import "./App.css";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import FindCentes from "./pages/FindCenters";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import MyDonations from "./pages/MyDonations";
import DonorRoute from "./components/DonorRoute";
import Error from "./pages/Error";
import HospitalRoute from "./components/HospitalRoute";
import BloodCenterRoute from "./components/BloodCenterRoute";
import BloodCenterInfo from "./pages/BloodCenterInfo";

function App() {
  return (
    <>
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/find-centers" element={<FindCentes />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/not-found" element={<Error />}></Route>
        <Route
          path="/my-donations"
          element={
            <PrivateRoute>
              <DonorRoute>
                <MyDonations />
              </DonorRoute>
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/order-blood"
          element={
            <PrivateRoute>
              <HospitalRoute>
                <MyDonations />
              </HospitalRoute>
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/my-centers-info"
          element={
            <PrivateRoute>
              <BloodCenterRoute>
                <BloodCenterInfo />
              </BloodCenterRoute>
            </PrivateRoute>
          }
        ></Route>
      </Routes>
      <div>count</div>
    </>
  );
}

export default App;

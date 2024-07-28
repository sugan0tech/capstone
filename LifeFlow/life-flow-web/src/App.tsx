import "./App.css";
import Footer from "./Components/Footer";
import NavBar from "./Components/NavBar";
import { Route, Routes } from "react-router-dom";
import AuthenticatedRoute from "./Components/AuthenticatedRoute";
import DonorRoute from "./Components/DonorRoute";
import BloodCenterRoute from "./Components/BloodCenterRoute";
import HospitalRoute from "./Components/HospitalRoute";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import FindCenters from "./Pages/FindCenters";
import NotFound from "./Pages/NotFound";
import MyDonations from "./Pages/MyDonations";
import BloodCenterConsole from "./Pages/BloodCenterConsole";
import MyAccount from "./Pages/MyAccount";

function App() {
  return (
    <>
      <NavBar></NavBar>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/find-centers" element={<FindCenters />}></Route>
        <Route path="/not-found" element={<NotFound />}></Route>
        <Route
          path="/login"
          element={
            <AuthenticatedRoute>
              <Login />
            </AuthenticatedRoute>
          }
        ></Route>
        <Route
          path="/register"
          element={
            <AuthenticatedRoute>
              <Register />
            </AuthenticatedRoute>
          }
        ></Route>
        <Route
          path="/my-donations"
          element={
            <AuthenticatedRoute>
              <DonorRoute>
                <MyDonations />
              </DonorRoute>
            </AuthenticatedRoute>
          }
        ></Route>
        <Route
          path="/my-account"
          element={
            <AuthenticatedRoute>
              <DonorRoute>
                <MyAccount />
              </DonorRoute>
            </AuthenticatedRoute>
          }
        ></Route>
        <Route
          path="/order-blood"
          element={
            <AuthenticatedRoute>
              <HospitalRoute>
                <MyDonations />
              </HospitalRoute>
            </AuthenticatedRoute>
          }
        ></Route>
        <Route
          path="/my-center-info"
          element={
            <AuthenticatedRoute>
              <BloodCenterRoute>
                <BloodCenterConsole />
              </BloodCenterRoute>
            </AuthenticatedRoute>
          }
        ></Route>
      </Routes>
      <Footer></Footer>
    </>
  );
}

export default App;

import { useState } from "react";
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
import BloodCentersInfo from "./Pages/BloodCentersInfo";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <NavBar></NavBar>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/find-centers" element={<FindCenters />}></Route>
        <Route path="/blood-center-info" element={<BloodCentersInfo />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/not-found" element={<NotFound />}></Route>
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
          path="/my-centers-info"
          element={
            <AuthenticatedRoute>
              <BloodCenterRoute>
                <BloodCenterConsole />
              </BloodCenterRoute>
            </AuthenticatedRoute>
          }
        ></Route>
      </Routes>

      <button className="btn btn-primary rounded-none">A button</button>
      <button className="px-6 py-2 font-medium bg-indigo-500 rounded-none hover:bg-indigo-500 text-white w-fit transition-all shadow-[5px_5px_0px_black] active:shadow-none hover:translate-x-[3px] active:translate-y-[3px]">
        Increase Count
      </button>

      <button className="btn w-64 rounded-full">Button</button>
      <Footer></Footer>
    </>
  );
}

export default App;

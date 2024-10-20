import "./App.css";
import Footer from "./Components/Footer";
import NavBar from "./Components/NavBar";
import { Route, Routes } from "react-router-dom";
import AuthenticatedRoute from "./Components/AuthenticatedRoute";
import DonorRoute from "./Components/Donor/DonorRoute.tsx";
import BloodCenterRoute from "./Components/BloodCenterRoute";
import ClientRoute from "./Components/ClientRoute.tsx";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import FindCenters from "./Pages/FindCenters";
import NotFound from "./Pages/NotFound";
import MyDonations from "./Pages/MyDonations";
import BloodCenterConsole from "./Pages/BloodCenterConsole";
import MyAccount from "./Pages/MyAccount";
import Donations from "./Pages/Donations";
import FindDonors from "./Pages/FindDonors.tsx";
import MyOrders from "./Pages/MyOrders";
import CreateDonor from "./Pages/CreateDonor";
import OrdersDashboard from "./Components/Admin/OrdersDashboard.tsx";

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
          path="/create-donor"
          element={
            <AuthenticatedRoute>
              <CreateDonor />
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
              <MyAccount />
            </AuthenticatedRoute>
          }
        ></Route>
        <Route
          path="/find-donors"
          element={
            <AuthenticatedRoute>
              <ClientRoute>
                <FindDonors />
              </ClientRoute>
            </AuthenticatedRoute>
          }
        ></Route>
        <Route
          path="/my-orders"
          element={
            <AuthenticatedRoute>
              <ClientRoute>
                <MyOrders />
              </ClientRoute>
            </AuthenticatedRoute>
          }
        ></Route>
        <Route
          path="/center-console"
          element={
            <AuthenticatedRoute>
              <BloodCenterRoute>
                <BloodCenterConsole />
              </BloodCenterRoute>
            </AuthenticatedRoute>
          }
        ></Route>
        <Route
          path="/donations"
          element={
            <AuthenticatedRoute>
              <BloodCenterRoute>
                <Donations />
              </BloodCenterRoute>
            </AuthenticatedRoute>
          }
        ></Route>
          <Route
              path="/order-dashboard"
              element={
                  <AuthenticatedRoute>
                      <BloodCenterRoute>
                          <OrdersDashboard />
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

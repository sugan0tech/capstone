import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import LifeFlowLogo from "../assets/LifeFlowLogo";
import DropdownMenuSvg from "../assets/DropdownMenuSvg";
import ThemeToggleBtn from "./ThemeToggleBtn";

function NavBar() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const [authButton, setAuthButton] = useState<JSX.Element | null>(null);
  const [accountButtons, setAuccontButtons] = useState<JSX.Element | null>(
    null
  );

  useEffect(() => {
    const renderSubMenu = () => {
      const status = localStorage.getItem("isAuthenticated");
      if (status) {
        switch (user?.role) {
          case "Donor":
            setAuccontButtons(
              <>
                <li>
                  <Link to="/my-donations">My Donations</Link>
                </li>
                <li>
                  <Link to="/my-account">Account Info</Link>
                </li>
              </>
            );
            break;
          case "Admin":
            setAuccontButtons(
              <>
                <li>
                  <a>Donation Slots</a>
                </li>
                <li>
                  <a>Account Info</a>
                </li>
                <li>
                  <a>Center Info</a>
                </li>
              </>
            );
            break;
          case "HospitalAdmin":
            setAuccontButtons(
              <>
                <li>
                  <a>Orders</a>
                </li>
                <li>
                  <a>Find Donors</a>
                </li>
                <li>
                  <a>Account Info</a>
                </li>
              </>
            );
            break;
          case "PharmaAdmin":
            setAuccontButtons(
              <>
                <li>
                  <a>Orders</a>
                </li>
                <li>
                  <a>Account Info</a>
                </li>
              </>
            );
            break;
        }
      }
    };
    const updateAuthButton = (path: string) => {
      const status = localStorage.getItem("isAuthenticated");
      if (status) {
        setAuthButton(
          <button className="btn btn-warning" onClick={logout}>
            Logout
          </button>
        );
      } else {
        switch (path) {
          case "/login":
            setAuthButton(
              <Link className="btn" to="/register">
                Register
              </Link>
            );
            break;
          case "/register":
            setAuthButton(
              <Link className="btn" to="/login">
                Login
              </Link>
            );
            break;
          default:
            setAuthButton(
              <Link className="btn" to="/login">
                Login
              </Link>
            );
        }
      }
    };

    updateAuthButton(location.pathname);
    renderSubMenu();
  }, [isAuthenticated, location.pathname, logout]);
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <DropdownMenuSvg />
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <a>Account</a>
              <ul className="p-2">{accountButtons}</ul>
            </li>
            <li>
              <Link to="/find-centers">Find Centers</Link>
            </li>
          </ul>
        </div>
        <div className="btn btn-ghost">
          <a className="text-xl">LifeFlow</a>
          <LifeFlowLogo h={24} w={24}></LifeFlowLogo>
        </div>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <details className="z-40">
              <summary>Account</summary>
              <ul className="p-2">{accountButtons}</ul>
            </details>
          </li>
          <li>
            <Link to="/find-centers">Find Centers</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end gap-4">
        <ThemeToggleBtn />
        {authButton}
      </div>
    </div>
  );
}

export default NavBar;

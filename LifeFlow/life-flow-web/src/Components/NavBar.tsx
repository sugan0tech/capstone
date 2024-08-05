import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ReactElement, useEffect, useState } from "react";
import LifeFlowLogo from "../assets/LifeFlowLogo";
import DropdownMenuSvg from "../assets/DropdownMenuSvg";
import ThemeToggleBtn from "./ThemeToggleBtn";
import NotificationButton from "./NotificationButton";
import LanguageSelector from "./LanguaguSelector.tsx";
import { useTranslation } from "react-i18next";

function NavBar() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  const [authButton, setAuthButton] = useState<ReactElement | null>(null);
  const [accountButtons, setAccountButtons] = useState<ReactElement | null>(
      null
  );
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

  useEffect(() => {
    const renderSubMenu = () => {
      if (isAuthenticated) {
        switch (user?.role) {
          case "Donor":
            setAccountButtons(
                <>
                  <li>
                    <Link to="/my-donations" onClick={muteAccountDropdown}>
                      {t("navbar.my_donations")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/my-account" onClick={muteAccountDropdown}>
                      {t("navbar.account_info")}
                    </Link>
                  </li>
                </>
            );
            break;
          case "Admin":
            setAccountButtons(
                <>
                  <li>
                    <Link to="/donations" onClick={muteAccountDropdown}>
                      {t("navbar.donations")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/center-console" onClick={muteAccountDropdown}>
                      {t("navbar.center_console")}
                    </Link>
                  </li>
                    <li>
                        <Link to="/order-dashboard" onClick={muteAccountDropdown}>
                            {t("navbar.orders")}
                        </Link>
                    </li>
                  <li>
                    <Link to="/my-account" onClick={muteAccountDropdown}>
                      {t("navbar.account_info")}
                    </Link>
                  </li>
                </>
            );
            break;
          case "HospitalAdmin":
            setAccountButtons(
                <>
                  <li>
                    <Link to="/my-orders" onClick={muteAccountDropdown}>
                      {t("navbar.orders")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/find-donors" onClick={muteAccountDropdown}>
                      {t("navbar.find_donors")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/my-account" onClick={muteAccountDropdown}>
                      {t("navbar.account_info")}
                    </Link>
                  </li>
                </>
            );
            break;
          case "PharmaAdmin":
            setAccountButtons(
                <>
                  <li>
                    <Link to="/my-orders" onClick={muteAccountDropdown}>
                      {t("navbar.orders")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/my-account" onClick={muteAccountDropdown}>
                      {t("navbar.account_info")}
                    </Link>
                  </li>
                </>
            );
            break;
          default:
            setAccountButtons(null);
        }
      } else {
        setAccountButtons(null);
      }
    };

    const updateAuthButton = (path: string) => {
      if (isAuthenticated) {
        setAuthButton(
            <button className="btn btn-warning" onClick={logout}>
              {t("navbar.logout")}
            </button>
        );
      } else {
        switch (path) {
          case "/login":
            setAuthButton(
                <Link className="btn" to="/register">
                  {t("navbar.register")}
                </Link>
            );
            break;
          case "/register":
            setAuthButton(
                <Link className="btn" to="/login">
                  {t("navbar.login")}
                </Link>
            );
            break;
          default:
            setAuthButton(
                <Link className="btn" to="/login">
                  {t("navbar.login")}
                </Link>
            );
        }
      }
    };

    updateAuthButton(location.pathname);
    renderSubMenu();
  }, [isAuthenticated, location.pathname, logout, user?.role, t]);

  const toggleAccountDropdown = () => {
    setIsAccountDropdownOpen(!isAccountDropdownOpen);
  };
  const muteAccountDropdown = () => {
    setIsAccountDropdownOpen(false);
  };

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
                <Link to="/home">{t("navbar.home")}</Link>
              </li>
              {isAuthenticated && (
                  <li>
                    <details>
                      <summary>{t("navbar.account")}</summary>
                      <ul className="p-2">{accountButtons}</ul>
                    </details>
                  </li>
              )}
              <li>
                <Link to="/find-centers">{t("navbar.find_centers")}</Link>
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
              <Link to="/home">{t("navbar.home")}</Link>
            </li>
            {isAuthenticated && (
                <li className="dropdown">
                  <div
                      tabIndex={0}
                      role="button"
                      onClick={toggleAccountDropdown}
                  >
                    {t("navbar.account")}
                  </div>
                  {isAccountDropdownOpen && (
                      <ul
                          tabIndex={0}
                          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                      >
                        {accountButtons}
                      </ul>
                  )}
                </li>
            )}
            <li>
              <Link to="/find-centers">{t("navbar.find_centers")}</Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end gap-4">
          <LanguageSelector />
          {isAuthenticated && <NotificationButton />}
          <ThemeToggleBtn />
          {authButton}
        </div>
      </div>
  );
}

export default NavBar;

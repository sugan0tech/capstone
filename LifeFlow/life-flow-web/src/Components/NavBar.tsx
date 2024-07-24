import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function NavBar() {
  const lcoation = useLocation();

  const updateAuthButton = (name: string) => {
    const login = useAuth();
    if (login.user != null) {
      return <Link to="/logout">Logout</Link>;
    }
    switch (name) {
      case "/login":
        return <Link to="/register">Register</Link>;

      case "/register":
        return <Link to="/login">Login</Link>;

      default:
        return <Link to="/login">Login</Link>;
    }
  };
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <a>Parent</a>
              <ul className="p-2">
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/find-centers">Find Centers</Link>
            </li>
          </ul>
        </div>
        <div className="btn btn-ghost">
          <a className="text-xl">LifeFlow</a>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={24}
            height={24}
            color={"#000000"}
            fill={"none"}
          >
            <path
              d="M9 7.54707C9 5.55959 10.6851 3.59556 11.8678 2.46181C12.5102 1.84606 13.4898 1.84606 14.1322 2.46181C15.3149 3.59556 17 5.55959 17 7.54707C17 9.4957 15.4853 11.5 13 11.5C10.5147 11.5 9 9.4957 9 7.54707Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M4 14H6.39482C6.68897 14 6.97908 14.0663 7.24217 14.1936L9.28415 15.1816C9.54724 15.3089 9.83735 15.3751 10.1315 15.3751H11.1741C12.1825 15.3751 13 16.1662 13 17.142C13 17.1814 12.973 17.2161 12.9338 17.2269L10.3929 17.9295C9.93707 18.0555 9.449 18.0116 9.025 17.8064L6.84211 16.7503"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13 16.5L17.5928 15.0889C18.407 14.8352 19.2871 15.136 19.7971 15.8423C20.1659 16.3529 20.0157 17.0842 19.4785 17.3942L11.9629 21.7305C11.4849 22.0063 10.9209 22.0736 10.3952 21.9176L4 20.0199"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <details>
              <summary>Parent</summary>
              <ul className="p-2">
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <Link to="/find-centers">Find Centers</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <div className="btn">{updateAuthButton(location.pathname)}</div>
      </div>
    </div>
  );
}

export default NavBar;

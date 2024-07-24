import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";

import { Outlet } from "react-router";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/Authcontext";
function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(user != null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("access-token");
    setIsLoggedIn(!!token);
  }, []);
  return (
    <div className="flex flex-col space-y-3 border-4 rounded-md">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavLink
              to="/"
              className={({ isActive }) => {
                return isActive ? "text-red-400" : "text-black";
              }}
            >
              <NavigationMenuLink>Home</NavigationMenuLink>
            </NavLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Donations</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="p-4 md:w-[400px] lg:w-[500px] flex flex-col space-y-2">
                {isLoggedIn && (
                  <NavLink
                    to="/donations/history"
                    className={({ isActive }) => {
                      return isActive ? "text-red-400" : "text-black";
                    }}
                  >
                    <NavigationMenuLink>My History</NavigationMenuLink>
                  </NavLink>
                )}
                <NavLink
                  to="/donations/centers"
                  className={({ isActive }) => {
                    return isActive ? "text-red-400" : "text-black";
                  }}
                >
                  <NavigationMenuLink>Blood Centers</NavigationMenuLink>
                </NavLink>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          {isLoggedIn && (
            <NavigationMenuItem>
              <NavigationMenuTrigger>Account</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="p-4 md:w-[400px] lg:w-[500px] flex flex-col space-y-2">
                  <NavLink
                    to="/account/info"
                    className={({ isActive }) => {
                      return isActive ? "text-red-400" : "text-black";
                    }}
                  >
                    <NavigationMenuLink>Account Info</NavigationMenuLink>
                  </NavLink>
                  <NavLink
                    to="/account/reset-password"
                    className={({ isActive }) => {
                      return isActive ? "text-red-400" : "text-black";
                    }}
                  >
                    <NavigationMenuLink>Reset Password</NavigationMenuLink>
                  </NavLink>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
      <Outlet />
    </div>
  );
}

export default Navbar;

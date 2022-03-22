import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { user } from "../redux/userSlice";

import { Navigate, NavLink } from "react-router-dom";
import { StyledNav } from "./uiComponents/styled/Nav.styles";
import { navItems } from "./index";
import LogoutIcon from "@mui/icons-material/Logout";

import { useNavigate } from "react-router-dom";
import useToken from "./auth/useToken";
import Button from "@mui/material/Button";

function Navigation() {
  const userProfile = useSelector(user);
  const { content } = userProfile;

  let navigate = useNavigate();
  const { revoke } = useToken();
  const Logout = () => {
    revoke();
    navigate("/");
    window.location.reload();
  };

  // Load navItems from components, iterate through, conditionally build nav items based on role content permissions
  // (this is just for visuals, users still need permitted tokens to access content anyway), so even if they hack, they get a 401 message!
  return (
    <div className="navigation">
      <StyledNav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="container">
          <NavLink className="navbar-brand" to="/">
            Inventory Management System
          </NavLink>
          <div>
            <ul className="navbar-nav ml-auto">
              {navItems.map((item, i) => {
                return content.includes(item.to) || content.includes("*") ? (
                  <li key={i} className="nav-item">
                    <NavLink className="nav-link" to={`/${item.to}`}>
                      {item.label}
                      <span className="sr-only"></span>
                    </NavLink>
                  </li>
                ) : (
                  ""
                );
              })}
              <li className="nav-item">
                <Button variant="text" sx={{ color: "white" }} onClick={Logout}>
                  <LogoutIcon />
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </StyledNav>
    </div>
  );
}

export default Navigation;

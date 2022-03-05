import React from "react";
import { NavLink } from "react-router-dom";

import { StyledNav } from "./uiComponents/styled/Nav.styles";

function Navigation() {
  return (
    <div className="navigation">
      <StyledNav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="container">
          <NavLink className="navbar-brand" to="/">
            Inventory Management System
          </NavLink>
          <div>
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  Home
                  <span className="sr-only">(current)</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/inventory">
                  Product Inventory
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/dashboard">
                  Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/manageproducts">
                  Add Products
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/manageorders">
                  Order Requests
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/supplierorders">
                  Supplier Order View
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/supplierorders">
                  Log Out
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </StyledNav>
    </div>
  );
}

export default Navigation;

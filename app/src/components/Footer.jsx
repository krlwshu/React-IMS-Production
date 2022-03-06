import React from "react";
import { StyledFooter } from "./uiComponents/styled/Nav.styles";

function Footer() {
  return (
    <div className="footer">
      <StyledFooter className="py-2 bg-dark fixed-bottom">
        <div className="container">
          <p className="m-0 text-center text-white">
            Production &copy; Inventory Management System
          </p>
        </div>
      </StyledFooter>
    </div>
  );
}

export default Footer;

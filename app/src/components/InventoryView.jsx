import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import { DataTable, InventoryCart, InventorySearch } from "./index";
import Badge from "@mui/material/Badge";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { Button } from "@mui/material";
import useToken from "./auth/useToken";

import styled from "styled-components";
import { Wrapper, StyledButton } from "./uiComponents/styled/Order.styles";

function Inventory() {
  const { verifyToken } = useToken();

  // Orders
  const [orderState, setOrderState] = useState([]);
  // Handle state of drawer
  const [cartOpen, setOpenState] = useState(false);

  //Sum up all qty of ordered inventory if orderState is set, else 0
  const productCount = orderState.length
    ? orderState
        .map((item) => item.qty)
        .reduce((prev, next) => parseInt(prev) + parseInt(next))
    : 0;

  useEffect(() => {}, [orderState]);

  return (
    <Wrapper>
      {/* <Button onClick={verifyToken} variant="contained" color="error">
        Check Auth
      </Button> */}
      <InventoryCart
        openState={cartOpen}
        setOpenState={setOpenState}
        orderState={orderState}
        setOrderState={setOrderState}
      />

      <StyledButton onClick={() => setOpenState(true)}>
        <Badge badgeContent={productCount} color="error">
          <AddShoppingCartIcon />
        </Badge>
      </StyledButton>

      {/* <div className="container"> */}
      <div className="row align-items-center my-5">
        <div className="col-lg-12">
          {/* <Typography variant="h5" component="h5">
            Inventory List
          </Typography> */}
          {/* <p>Search for parts and order new items</p> */}
          {/* <DataTable setOrderState={setOrderState} orderState={orderState} /> */}
          <InventorySearch
            setOrderState={setOrderState}
            orderState={orderState}
          />
        </div>
      </div>
      {/* </div> */}
    </Wrapper>
  );
}

export default Inventory;

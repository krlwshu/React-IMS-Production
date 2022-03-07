import React, { useState, useEffect } from "react";
import { InventoryCart, InventorySearch } from "./index";
import Badge from "@mui/material/Badge";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { Wrapper, StyledButton } from "./uiComponents/styled/Order.styles";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { selectItems } from "../redux/cartSlice";

function Inventory() {
  const items = useSelector(selectItems);
  const itemCount = items.length
    ? items
        .map((item) => item.requested_quantity)
        .reduce((prev, next) => parseInt(prev) + parseInt(next))
    : 0;

  // Orders
  const [orderState, setOrderState] = useState([]);

  // Handle state of drawer
  const [cartOpen, setOpenState] = useState(false);

  //Sum up all qty of ordered inventory if orderState is set, else 0
  const productCount = orderState.length
    ? orderState
        .map((item) => item.requested_quantity)
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
        <Badge badgeContent={itemCount} color="error">
          <AddShoppingCartIcon />
        </Badge>
      </StyledButton>

      {/* <div className="container"> */}
      <div className="row align-items-center">
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

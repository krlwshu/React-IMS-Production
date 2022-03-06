import React from "react";

import Button from "@mui/material/Button";
import { addItem, delItem } from "../redux/cartSlice";
import { useSelector, useDispatch } from "react-redux";
import { selectItems } from "../redux/cartSlice";

export default function TestRedux() {
  const dispatch = useDispatch();

  const payload = {
    id: 123,
    manufacturer: "Huawei",
    quantity: 1,
  };

  const addToCart = () => {
    dispatch(addItem(payload));
  };
  const delFromCart = () => {
    dispatch(delItem(payload));
  };

  const items = useSelector(selectItems);

  return (
    <div style={{ paddingTop: "5rem" }} className="container">
      <h1>Test State Update</h1>
      <Button
        aria-label="Increment value"
        onClick={() => addToCart()}
        variant="contained"
        color="success"
      >
        +
      </Button>
      <Button variant="outlined" color="primary">
        {items.length}
      </Button>
      <Button
        aria-label="Increment value"
        onClick={() => delFromCart()}
        variant="contained"
        color="error"
      >
        -
      </Button>

      {items.map((item) => (
        <p
          key={item.id}
        >{`${item.id} ${item.manufacturer} ${item.quantity}`}</p>
      ))}
    </div>
  );
}

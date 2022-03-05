import React from "react";

import Button from "@mui/material/Button";
import { addItem } from "../redux/cartSlice";
import { useSelector, useDispatch } from "react-redux";
import { selectItems } from "../redux/cartSlice";

export default function TestRedux() {
  const dispatch = useDispatch();

  const item = [
    {
      id: Date.now(),
      manufacturer: "Huawei",
      quantity: 1,
    },
  ];

  const addToCart = () => {
    dispatch(addItem(item));
  };

  const items = useSelector(selectItems);

  const logItems = () => {
    console.log(selectItems);
  };

  return (
    <div style={{ paddingTop: "5rem" }} className="container">
      <h1>Test State Update</h1>
      <h1></h1>
      <Button
        aria-label="Increment value"
        onClick={() => addToCart()}
        variant="outlined"
        color="success"
      >
        +
      </Button>

      <Button onClick={() => logItems()} variant="outlined" color="success">
        CLG current items
      </Button>
      {/* <Button
        aria-label="Decrement value"
        onClick={() => dispatch(decrement())}
        variant="outlined"
        color="error"
      >
        -
      </Button> */}

      {items.map((item) => (
        <p
          key={item.id}
        >{`${item.id} ${item.manufacturer} ${item.quantity}`}</p>
      ))}
    </div>
  );
}
